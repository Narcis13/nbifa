import { ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

export function useLocations() {
  const store = useStore()
  
  const locuri = ref([])
  const locuriintrare = ref([])
  const locuriiesire = ref([])
  const locintrare = ref(null)
  const lociesire = ref(null)
  
  const initializareLocuri = async () => {
    try {
      const token = store.getters.token
      const response = await axios.get(
        `${process.env.host}locuri/toatelocurile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      locuriintrare.value = []
      locuriiesire.value = []
      locuri.value = []
      
      response.data.locuri.map(loc => {
        const locObj = {
          id: loc.id,
          label: loc.denumire,
          value: loc.id
        }
        
        locuriintrare.value.push(locObj)
        locuriiesire.value.push(locObj)
        locuri.value.push(locObj)
      })
      
      if (locuri.value.length > 0) {
        lociesire.value = locuri.value[0]
        locintrare.value = locuri.value[0]
      }
      
    } catch (error) {
      console.error('Eroare la incarcarea locurilor:', error)
    }
  }
  
  const filterLocuriIntrare = (val) => {
    if (val.length < 2) {
      return locuri.value
    }
    const needle = val.toLowerCase()
    return locuri.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  }
  
  const filterLocuriIesire = (val) => {
    if (val.length < 2) {
      return locuri.value
    }
    const needle = val.toLowerCase()
    return locuri.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  }
  
  const resetLocuri = () => {
    if (locuri.value.length > 0) {
      lociesire.value = locuri.value[0]
      locintrare.value = locuri.value[0]
    }
  }
  
  return {
    locuri,
    locuriintrare,
    locuriiesire,
    locintrare,
    lociesire,
    initializareLocuri,
    filterLocuriIntrare,
    filterLocuriIesire,
    resetLocuri
  }
}