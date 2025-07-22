import { ref, computed } from 'vue'
import { date } from 'quasar'

export function useDateInterval() {
  const datainceput = ref('2019/02/01')
  const datasfirsit = ref('2019/02/01')
  
  const formattedInterval = computed(() => {
    return `${datainceput.value} : ${datasfirsit.value}`
  })
  
  const setDateInterval = (startDate, endDate) => {
    datainceput.value = date.formatDate(startDate, 'YYYY/MM/DD')
    datasfirsit.value = date.formatDate(endDate, 'YYYY/MM/DD')
  }
  
  const selectPredefinedInterval = (intervalType) => {
    const today = new Date()
    let firstDay, lastDay
    
    switch (intervalType) {
      case 0: // Luna aceasta
        firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
        
      case 1: // Luna trecuta
        firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
        break
        
      case 2: // Anul acesta
        firstDay = new Date(today.getFullYear(), 0, 1)
        lastDay = today
        break
        
      default:
        return false
    }
    
    setDateInterval(firstDay, lastDay)
    return true
  }
  
  const getIntervalDates = () => {
    return {
      inceput: datainceput.value,
      sfirsit: datasfirsit.value
    }
  }
  
  return {
    datainceput,
    datasfirsit,
    formattedInterval,
    setDateInterval,
    selectPredefinedInterval,
    getIntervalDates
  }
}