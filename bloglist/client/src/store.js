import { create } from 'zustand'

const useNotificationStore = create(set, () => ({
  notif: {
    type: null,
    message: null
  },
  actions: {
    setNotif: (type, message) => {
      set(() => { type, message });

      setTimeout(() => {
        set(() => ({
          type: null,
          message: null,
        }));
      }, 5000);
    }
  }
}))

export const useNotification = () => useNotificationStore(state => state.notif)
export const setNotification = () => useNotificationStore(state => state.actions)