import { create } from 'zustand'
import blogService from "./services/blogs";

const useNotificationStore = create(set => ({
  notification: {
    type: null,
    message: null
  },
  setNotification: (type, message) => {
    set(() => ({ notification: { type, message } }))
    setTimeout(() => set(() => ({ notification: { type: null, message: null } })), 5000)
  }
}))

const useBlogStore = create(set => ({
  blogs: [],
  actions: {
    init: async () => {
      const blogslist = await blogService.getAll()
      set({ blogs: blogslist.toSorted((a, b) => b.likes - a.likes) })
    },
    add: async (blogFields) => {
      try {
        const res = await blogService.create(blogFields);
        set(state => ({ blogs: state.blogs.concat(res) }))
        useNotificationStore.getState().setNotification(
          "success",
          `Added new blog titled "${blogFields.title}" By "${blogFields.author}"`,
        );
      } catch (error) {
        useNotificationStore.getState().setNotification("error", `Failed to submit blog post. Error: ${error}`);
      }
    },
    like: async (updatedBlog) => {
      try {
        const res = await blogService.addLike(updatedBlog);
        set(state => ({
          blogs: state.blogs.map((blog) => (blog.id === res.id ? res : blog))
        }))

        useNotificationStore.getState().setNotification(
          "success",
          `Liked "${updatedBlog.title}" By "${updatedBlog.author}"`,
        );
      } catch (error) {
        useNotificationStore.getState().setNotification("error", `Failed to like blog post. Error: ${error}`);
      }
    },
    remove: async (blogToDelete) => {
      try {
        await blogService.deleteBlog(blogToDelete);
        set(state => ({
          blogs: state.blogs.filter((blog) => blog.id !== blogToDelete.id)
        }));
        useNotificationStore.getState().setNotification(
          "success",
          `Deleted "${blogToDelete.title}" By "${blogToDelete.author}"`,
        );
      } catch (error) {
        useNotificationStore.getState().setNotification("error", `Failed to delete blog post. Error: ${error}`);
      }
    }
  }
}))

const useUserStore = create((set, get) => ({
  user: null,
  actions: {
    init: async () => {
      const loggedUserJSON = window.localStorage.getItem("BlogAppUser");
      if (loggedUserJSON) {
        const userObj = JSON.parse(loggedUserJSON);
        await blogService.setToken(userObj.token);
        set({ user: userObj })
      }
    }
  }
}))



export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationAction = () => useNotificationStore(state => state.setNotification)
export const useBlog = () => useBlogStore(state => state.blogs)
export const useBlogActions = () => useBlogStore(state => state.actions)
export const useUserActions = () => useUserStore(state => state.actions)
export const useUser = () => useUserStore(state => state.user)