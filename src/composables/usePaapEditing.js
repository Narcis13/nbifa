import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import axios from 'axios'

export function usePaapEditing() {
  const store = useStore()
  const $q = useQuasar()
  
  const confirm = ref(false)
  const adaug_pozitie = ref(false)
  const errorProtein = ref(false)
  const errorMessageProtein = ref('')
  const valoareNoua = ref(null)
  const colMultiEdit = ref(null)
  const compMultiEdit = ref(null)

  const coloaneMultiEdit = ref([
    { label: 'Cod CPV', value: 'CodCPV', comp: 'paap-codcpv' },
    { label: 'Procedura', value: 'procedura', comp: 'paap-proceduri' },
    { label: 'Responsabil', value: 'responsabil', comp: 'paap-responsabil' },
    { label: 'Articol Bugetar', value: 'artbug', comp: 'paap-artbug' }
  ])

  // Computed
  const amAlesOColoanaDeEditat = computed(() => {
    return colMultiEdit.value !== null
  })

  // Validation
  const proteinRangeValidation = (val) => {
    if (val < 1) {
      errorProtein.value = true
      errorMessageProtein.value = 'Valoarea introdusa nu poate fi negativa'
      return false
    }
    errorProtein.value = false
    errorMessageProtein.value = ''
    return true
  }

  // Edit methods
  const editezObiectAky = async (id, text) => {
    console.log('editez obiect aky ', id, text)
    const token = store.getters.token
    
    try {
      await axios.put(`${process.env.host}paap/updateobiectaky/${id}`, { 'text': text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Edit object error:', err)
    }
  }

  const editeaza = async (id, cheie, valoarenoua) => {
    console.log('editez ', id, cheie, valoarenoua)
    const token = store.getters.token
    
    try {
      await axios.put(`${process.env.host}paap/atomicupdate/${id}`, { [cheie]: valoarenoua }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Edit error:', err)
    }
  }

  const coloanaSelectata = (v) => {
    valoareNoua.value = v
  }

  const alegColDeEditat = () => {
    compMultiEdit.value = colMultiEdit.value.comp
  }

  const aplicaModificari = async (selected, paap) => {
    console.log('Valoare noua ....', valoareNoua.value)
    colMultiEdit.value = null
    
    let iduri = []
    selected.value.map(el => iduri.push(el.id))
    const token = store.getters.akytoken
    
    function eSelectat(id) {
      return selected.value.some(el => el.id == id)
    }

    try {
      const id = 999
      await axios.put(`${process.env.host}paap/${id}`, {
        [valoareNoua.value.cimp]: valoareNoua.value,
        iduri
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      $q.notify({
        message: 'Actualizare reusita!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })

      paap.value.map(poz_paap => {
        if (eSelectat(poz_paap.id)) {
          poz_paap[valoareNoua.value.ce] = valoareNoua.value.valoare.label
        }
      })

      selected.value = []
    } catch (err) {
      console.error('Apply modifications error:', err)
    }
  }

  const pozitieAdaugata = (paapCompAn, anselectat, paaptableRef) => {
    console.log('receptionat eveniment pozitie-adaugata')
    adaug_pozitie.value = false
    paapCompAn(anselectat)
    paaptableRef.value?.scrollTo(0)
  }

  return {
    // State
    confirm,
    adaug_pozitie,
    errorProtein,
    errorMessageProtein,
    valoareNoua,
    colMultiEdit,
    compMultiEdit,
    coloaneMultiEdit,
    
    // Computed
    amAlesOColoanaDeEditat,
    
    // Methods
    proteinRangeValidation,
    editezObiectAky,
    editeaza,
    coloanaSelectata,
    alegColDeEditat,
    aplicaModificari,
    pozitieAdaugata
  }
}