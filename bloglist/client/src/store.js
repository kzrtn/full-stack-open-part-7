import { create } from 'zustand'

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

  }
}))

export const useNotification = () => useNotificationStore(state => state.notification)
export const setNotification = () => useNotificationStore(state => state.setNotification)