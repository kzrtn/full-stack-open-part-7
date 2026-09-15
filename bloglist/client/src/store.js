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

const useBlogStore = create((set, get) => ({
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
    }
  }
}))

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationAction = () => useNotificationStore(state => state.setNotification)
export const useBlog = () => useBlogStore(state => state.blogs)
export const useBlogActions = () => useBlogStore(state => state.actions)