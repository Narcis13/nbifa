import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export function usePaapData() {
  const store = useStore()
  const paap = ref([])
  const selected = ref([])
  const anselectat = ref(new Date().getFullYear().toString())
  
  const ancur = ref(new Date().getFullYear().toString())
  const anante = ref((new Date().getFullYear() - 1).toString())
  const anpost = ref((new Date().getFullYear() + 1).toString())

  // Computed properties
  const DeLaAchizitii = computed(() => {
    return store.getters.akyroluserlogat === "Achizitii"
  })

  const ultimulAn = computed(() => {
    return anselectat.value == anpost.value
  })

  const nrPozitii = computed(() => {
    return paap.value.length
  })

  const sumaTotala = computed(() => {
    let total = 0
    paap.value.map(p => {
      total += parseFloat(p.valoare)
    })
    return total.toFixed(2)
  })

  const eCevaSelectat = computed(() => {
    return selected.value.length > 0
  })

  // Methods
  const paapCompAn = async (an) => {
    const token = store.getters.akytoken
    const rol = store.getters.akyroluserlogat
    const id_comp = store.getters.idcompartimentakyuserlogat
    
    console.log('PAAP Comp An', rol, id_comp)
    const idc = (rol === "Achizitii") ? 0 : id_comp
    
    try {
      const res = await axios.get(`${process.env.host}paap/paapintegral/${idc}/${an}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Rspuns la tot paap-ul', res)
      paap.value = [...res.data.paap]
    } catch (err) {
      console.error('Error loading PAAP data:', err)
    }
  }

  const schimbaAn = (value) => {
    selected.value = []
    paapCompAn(value)
  }

  const loadInitialData = () => {
    paapCompAn(ancur.value)
  }

  return {
    // State
    paap,
    selected,
    anselectat,
    ancur,
    anante,
    anpost,
    
    // Computed
    DeLaAchizitii,
    ultimulAn,
    nrPozitii,
    sumaTotala,
    eCevaSelectat,
    
    // Methods
    paapCompAn,
    schimbaAn,
    loadInitialData
  }
}