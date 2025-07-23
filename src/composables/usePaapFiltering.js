import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export function usePaapFiltering() {
  const store = useStore()
  
  const filter = ref('')
  const filtruAplicat = ref(false)
  
  const rangeValori = reactive({
    min: 0,
    max: 250000
  })
  
  const toateArticolele = ref(true)
  const toateValorile = ref(true)
  const toateProcedurile = ref(true)
  const toateCompartimentele = ref(true)
  
  const strFiltru = reactive({
    artbug: '',
    proceduri: '',
    comp: '',
    range: ''
  })

  // Methods
  const resetFiltre = () => {
    toateArticolele.value = true
    toateCompartimentele.value = true
    toateValorile.value = true
    toateProcedurile.value = true
  }

  const aplicFiltru = async (anselectat, paap, DeLaAchizitii) => {
    console.log('Aplica filtru...', toateValorile.value, rangeValori)
    filtruAplicat.value = true
    
    const token = store.getters.akytoken
    let filtru_valori = ""
    let filtru_initial = `paap.stare='activ' and paap.anplan=${anselectat}`
    
    if (!DeLaAchizitii) {
      strFiltru.comp = ` and paap.id_compartiment=${store.getters.idcompartimentakyuserlogat}`
    }
    
    if (!toateValorile.value) {
      filtru_valori = ` and paap.valoare>=${rangeValori.min} and paap.valoare<=${rangeValori.max}`
    }
    
    const filtru_cumulat = filtru_initial + strFiltru.artbug + strFiltru.proceduri + filtru_valori + strFiltru.comp
    
    try {
      const res = await axios.post(`${process.env.host}paap/paapfiltrat`, {
        filtru: filtru_cumulat,
        an: anselectat
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Rspuns la paap filtrat', res)
      paap.value = [...res.data.paap]
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  const stergFiltru = (paapCompAn, anselectat) => {
    filtruAplicat.value = false
    Object.assign(strFiltru, {
      artbug: '',
      proceduri: '',
      comp: '',
      range: ''
    })
    paapCompAn(anselectat)
  }

  const alegFiltruArtBug = (v) => {
    strFiltru.artbug = ` and paap.artbug='${v.valoare.value}'`
  }

  const alegFiltruProceduri = (v) => {
    strFiltru.proceduri = ` and paap.id_procedura=${v.valoare.value}`
  }

  const alegFiltruCompartimente = (v) => {
    strFiltru.comp = ` and paap.id_compartiment=${v.valoare.value}`
  }

  return {
    // State
    filter,
    filtruAplicat,
    rangeValori,
    toateArticolele,
    toateValorile,
    toateProcedurile,
    toateCompartimentele,
    strFiltru,
    
    // Methods
    resetFiltre,
    aplicFiltru,
    stergFiltru,
    alegFiltruArtBug,
    alegFiltruProceduri,
    alegFiltruCompartimente
  }
}