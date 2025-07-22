import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

export function usePaapData() {
  const store = useStore()
  const paap = ref([])
  const selected = ref([])
  const filter = ref('')
  
  const coloane_paap = ref([
    {
      name: 'id',
      label: '#',
      field: 'id'
    },
    {
      name: 'articol',
      required: true,
      label: 'Obiectul achizitiei',
      align: 'left',
      style: 'max-width: 300px',
      field: 'obiectachizitie_text',
      format: val => `${val}`,
      sortable: true
    },
    { 
      name: 'cantitate', 
      align: 'right',
      label: 'Cantitate', 
      field: 'cant_ramasa', 
      sortable: true 
    }
  ])
  
  const pagination = ref({
    rowsPerPage: 0
  })
  
  const loadPaapData = async () => {
    const token = store.getters.akytoken
    const rol = store.getters.akyroluserlogat
    const id_comp = store.getters.idcompartimentakyuserlogat
    const an = new Date().getFullYear().toString()
    
    console.log('PAAP Comp An', rol, id_comp)
    const idc = rol === "Achizitii" ? 0 : id_comp
    
    try {
      const response = await axios.get(
        `${process.env.host}paap/paapsolduri/${idc}/${an}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      console.log('Raspuns la paap cu solduri', response)
      paap.value = [...response.data.paap[0]]
    } catch (err) {
      console.error('Error loading PAAP data:', err)
    }
  }
  
  onMounted(() => {
    loadPaapData()
  })
  
  return {
    paap,
    selected,
    filter,
    coloane_paap,
    pagination,
    loadPaapData
  }
}