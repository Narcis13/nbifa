import { ref } from 'vue'

// Simple event bus implementation for Vue 3
class EventBus {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event, callback) {
    if (!this.events[event]) return
    
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event, ...args) {
    if (!this.events[event]) return
    
    this.events[event].forEach(callback => {
      callback(...args)
    })
  }
}

// Create a singleton instance
const eventBus = new EventBus()

// Composable to use the event bus
export function useEventBus() {
  return {
    on: eventBus.on.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus)
  }
}