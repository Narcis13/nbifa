import { ref, computed } from 'vue'
import { date } from 'quasar'
import axios from 'axios'
import { useStore } from 'vuex'

export function useReferateListing() {
  const store = useStore()
  
  const rows = ref([])
  const selected = ref([])
  const adaug_referat = ref(false)
  
  const pagination = ref({
    page: 1,
    rowsPerPage: 10
  })
  
  const columns = ref([
    {
      name: 'id',
      label: 'ID',
      align: 'left',
      field: 'id',
      sortable: true
    },
    { 
      name: 'data', 
      align: 'center', 
      label: 'Data', 
      field: 'data', 
      sortable: true 
    },
    { 
      name: 'obiect_achizitie', 
      align: 'left',
      label: 'Obiect achizitie', 
      field: 'obiect_achizitie', 
      sortable: true 
    },
    { 
      name: 'valoare', 
      label: 'Valoare', 
      field: 'valoare',
      align: 'right' 
    },
    { 
      name: 'compartiment', 
      label: 'Compartiment', 
      field: 'compartiment',
      align: 'left' 
    },
    { 
      name: 'stare', 
      label: 'Stare', 
      field: 'stare',
      align: 'left' 
    },
    { 
      name: 'data_modificare', 
      label: 'Data modificare', 
      field: 'data_modificare',
      align: 'left' 
    }
  ])
  
  // Computed
  const pagesNumber = computed(() => {
    return Math.ceil(rows.value.length / pagination.value.rowsPerPage)
  })
  
  // Methods
  const printRN = () => {
    console.log('Urmeaza sa printez RN', selected.value[0])
    window.open(process.env.host + 'rapoarte/unreferat/' + selected.value[0].id, '_blank')
  }
  
  const toateReferatele = async () => {
    console.log('toate referatele...')
    adaug_referat.value = false
    
    const token = store.getters.akytoken
    const rol = store.getters.akyroluserlogat
    const id_comp = store.getters.idcompartimentakyuserlogat
    
    const idc = rol === "Achizitii" ? 0 : id_comp
    rows.value = []
    
    try {
      const response = await axios.get(
        process.env.host + 'rn/toatereferatele/' + idc,
        { headers: { "Authorization": `Bearer ${token}` } }
      )
      
      console.log('Raspuns la toate referatele', response.data)
      
      response.data.referate.forEach(p => {
        rows.value.push({
          id: p.id,
          data: date.formatDate(p.data, 'DD/MM/YYYY'),
          obiect_achizitie: p.obiect_achizitie,
          valoare: p.valoare,
          data_modificare: date.formatDate(p.data, 'DD/MM/YYYY H:mm'),
          compartiment: p.denumire,
          stare: p.stare
        })
      })
    } catch (err) {
      console.error('Error loading referate:', err)
    }
  }
  
  return {
    rows,
    selected,
    adaug_referat,
    pagination,
    columns,
    pagesNumber,
    printRN,
    toateReferatele
  }
}