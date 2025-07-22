import { defineStore } from 'pinia'

export const useEventsStore = defineStore('events', {
  state: () => ({
    listeners: {}
  }),

  actions: {
    emit(event, payload) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => callback(payload))
      }
    },

    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(callback)
      
      // Return unsubscribe function
      return () => {
        const index = this.listeners[event].indexOf(callback)
        if (index > -1) {
          this.listeners[event].splice(index, 1)
        }
      }
    },

    off(event, callback) {
      if (this.listeners[event]) {
        const index = this.listeners[event].indexOf(callback)
        if (index > -1) {
          this.listeners[event].splice(index, 1)
        }
      }
    }
  }
})