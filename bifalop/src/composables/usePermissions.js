import { computed } from 'vue'

export function usePermissions(rol, logat) {
  const isAdmin = computed(() => rol === 'admin')
  const esteLogat = computed(() => logat)
  
  return {
    isAdmin,
    esteLogat
  }
}