import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useEventBus } from './useEventBus'

export function useMaterialeCrud() {
  const $q = useQuasar()
  const store = useStore()
  const eventBus = useEventBus()
  
  const materiale = ref([])
  const filter = ref('')
  const selected = ref([])
  
  const pagination = ref({
    sortBy: 'id',
    descending: true,
    page: 1,
    rowsPerPage: 12
  })
  
  const columns = ref([
    { 
      name: 'id', 
      align: 'center', 
      label: 'id', 
      field: 'id', 
      sortable: true 
    },
    {
      name: 'denumire',
      required: true,
      label: 'Denumire',
      align: 'left',
      field: 'denumire',
      format: val => `${val}`,
      sortable: true
    },
    { 
      name: 'um', 
      align: 'center', 
      label: 'U / M', 
      field: 'um', 
      sortable: true 
    },
    { 
      name: 'pretpredefinit', 
      label: 'Pret predefinit', 
      field: 'pretpredefinit', 
      sortable: true,
      align: 'right'
    },
    { 
      name: 'gestiune', 
      label: 'Gestiune', 
      field: 'gestiune',
      align: 'left'
    },
    { 
      name: 'user', 
      label: 'Utilizator', 
      field: 'user',
      align: 'left'
    },
    { 
      name: 'codimport', 
      label: 'Cod', 
      field: 'cod_import',
      align: 'left'
    },
    { 
      name: 'datamodificare', 
      label: 'Data modificare', 
      field: 'datamodificare', 
      sortable: true,
      align: 'left' 
    }
  ])
  
  // Load materials
  const loadMateriale = async (gestiuneId) => {
    const token = store.getters.token
    const id = gestiuneId || store.getters.gestiuneCurenta.id
    
    try {
      const response = await axios.get(
        process.env.host + `materiale/toate/${id}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      console.log('Raspuns la toate materialele', response.data)
      materiale.value = [...response.data.materiale]
    } catch (err) {
      console.error('Error loading materials:', err)
    }
  }
  
  // Edit material
  const editeaza = async (id, cheie, valoarenoua) => {
    console.log('editez', id, cheie, valoarenoua)
    const token = store.getters.token
    
    try {
      await axios.put(
        process.env.host + `materiale/${id}`,
        { [cheie]: valoarenoua },
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      // Update modification date in grid
      materiale.value = materiale.value.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            datamodificare: new Date().toLocaleDateString('ro-RO')
          }
        }
        return item
      })
    } catch (err) {
      console.error('Error editing material:', err)
    }
  }
  
  // Delete material
  const deleteRow = async () => {
    console.log('Sterg material', selected.value)
    
    if (selected.value.length === 0) return
    
    const token = store.getters.token
    const id = selected.value[0].id
    const denumire = selected.value[0].denumire
    
    try {
      await axios.patch(
        process.env.host + `materiale/sterg/${id}`,
        {},
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      $q.notify({
        message: `Materialul selectat ${denumire} a fost invalidat!`,
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      // Remove from list
      const index = materiale.value.findIndex(item => item.id === id)
      if (index > -1) {
        materiale.value.splice(index, 1)
      }
      
      selected.value = []
    } catch (err) {
      console.error('Error deleting material:', err)
    }
  }
  
  // Handle new material added
  const materialAdaugat = (e) => {
    console.log('Sesizat eveniment material adaugat', e)
    // Reload materials or add to list
    loadMateriale()
  }
  
  // Handle gestiune change
  const schimbaGestiunea = (id) => {
    loadMateriale(id)
  }
  
  // Lifecycle
  onMounted(() => {
    console.log('Gestiune curenta', store.getters.gestiuneCurenta, 'id user logat', store.getters.userid)
    eventBus.on('schimbgestiunea', schimbaGestiunea)
    loadMateriale()
  })
  
  onBeforeUnmount(() => {
    eventBus.off('schimbgestiunea', schimbaGestiunea)
  })
  
  return {
    materiale,
    filter,
    selected,
    pagination,
    columns,
    editeaza,
    deleteRow,
    materialAdaugat
  }
}