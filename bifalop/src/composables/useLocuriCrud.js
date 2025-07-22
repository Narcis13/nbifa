import { ref, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export function useLocuriCrud() {
  const $q = useQuasar()
  const store = useStore()
  
  const locuri = ref([])
  const numenou = ref('')
  const timer = ref(null)
  
  // Load all locations
  const loadLocuri = async () => {
    const token = store.getters.token
    
    try {
      const response = await axios.get(
        process.env.host + 'locuri/toatelocurile',
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      console.log('Raspuns la toate locurile', response)
      locuri.value = [...response.data.locuri]
    } catch (err) {
      console.error('Error loading locuri:', err)
    }
  }
  
  // Add new location
  const adaugaLoc = async () => {
    const token = store.getters.token
    const denumireNoua = numenou.value
    
    try {
      const response = await axios.post(
        process.env.host + 'locuri/locnou',
        {
          denumire: denumireNoua,
          stare: 'ACTIV',
          prioritate: 1
        },
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      console.log('Am primit idul,', response.data, denumireNoua)
      
      $q.notify({
        message: `Locul ${denumireNoua} a fost adaugat cu succes!`,
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      const locNou = {
        id: response.data.id,
        denumire: denumireNoua,
        stare: 'ACTIV',
        nou: true,
        prioritate: 1
      }
      
      locuri.value.unshift(locNou)
      numenou.value = ''
      
    } catch (err) {
      console.log('Eroare.............', err.response?.data?.message)
      
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: `ATENTIE! ${err.response?.data?.message || 'Eroare necunoscuta'}`
      })
    }
  }
  
  // Delete location
  const stergeLoc = (id, reset) => {
    const token = store.getters.token
    
    timer.value = setTimeout(async () => {
      reset()
      
      try {
        await axios.patch(
          process.env.host + `locuri/${id}`,
          {},
          { headers: { "Authorization": `Bearer ${token}` } }
        )
        
        // Remove from list
        const index = locuri.value.findIndex(item => item.id === id)
        if (index > -1) {
          locuri.value.splice(index, 1)
        }
      } catch (err) {
        console.error('Error deleting location:', err)
      }
    }, 1000)
  }
  
  // Slide item handlers
  const onLeft = (id, { reset }) => {
    console.log('asta primesc la on Left', id, reset)
    $q.notify('Loc de dispunere sters cu succes')
    stergeLoc(id, reset)
  }
  
  const onRight = ({ reset }) => {
    $q.notify('Right action triggered. Resetting in 1 second.')
    reset()
  }
  
  // Cleanup
  onBeforeUnmount(() => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  })
  
  return {
    locuri,
    numenou,
    loadLocuri,
    adaugaLoc,
    onLeft,
    onRight
  }
}