import { create } from 'zustand'
import blogService from "./services/blogs";
import blogs from './services/blogs';

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
    }
  }
}))

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationAction = () => useNotificationStore(state => state.setNotification)
export const useBlog = () => useBlogStore(state => state.blogs)
export const useBlogActions = () => useBlogStore(state => state.actions)