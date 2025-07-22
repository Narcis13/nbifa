import { ref, computed } from 'vue'
import { date, uid } from 'quasar'

export function useReferatForm() {
  const data_referat = ref(date.formatDate(new Date(), 'YYYY/MM/DD'))
  const uuid = ref(uid())
  const obiect_achizitie = ref('')
  const justificare = ref('Asigurarea derularii optime a activitatilor institutiei')
  const cantitate_maxima = ref(1)
  
  const linieRN = ref({
    idpozPAAP: 0,
    denumire: '',
    codcpv: '',
    detalii_tehnice: '',
    cantitate: 1,
    pret: 0
  })
  
  const liniiRN = ref([])
  const repere_selectate = ref([])
  
  const pagination_repere = ref({
    page: 1,
    rowsPerPage: 10
  })
  
  const columns = ref([
    {
      name: 'denumire',
      required: true,
      label: 'Denumire',
      align: 'left',
      field: 'denumire',
      sortable: true
    },
    { 
      name: 'codcpv', 
      align: 'center', 
      label: 'CodCPV', 
      field: 'codcpv', 
      sortable: true 
    },
    { 
      name: 'detalii', 
      label: 'Detalii', 
      field: 'detalii_tehnice', 
      sortable: true,
      align: 'left' 
    },
    { 
      name: 'cantitate', 
      label: 'Cantitate', 
      field: 'cantitate',
      align: 'right'
    },
    { 
      name: 'pret', 
      label: 'Pret', 
      field: 'pret',
      align: 'right' 
    },
    { 
      name: 'valoare', 
      label: 'Valoare', 
      field: 'valoare',
      align: 'right'
    }
  ])
  
  // Computed properties
  const valoareLinieRN = computed(() => {
    return linieRN.value.cantitate * linieRN.value.pret
  })
  
  const cantitateValida = computed(() => {
    return linieRN.value.cantitate !== '' && 
           linieRN.value.cantitate > 0 && 
           linieRN.value.cantitate <= cantitate_maxima.value
  })
  
  const informatiiComplete = computed(() => {
    return linieRN.value.detalii_tehnice.length > 6 && 
           linieRN.value.codcpv != '' && 
           linieRN.value.denumire != '' && 
           valoareLinieRN.value > 0 && 
           cantitateValida.value
  })
  
  const documentValid = computed(() => {
    return obiect_achizitie.value.length > 5 && liniiRN.value.length > 0
  })
  
  const valoaretotala = computed(() => {
    let total = 0
    liniiRN.value.map(linie => {
      total += linie.valoare
    })
    return total.toFixed(2)
  })
  
  // Methods
  const pozPAAPSelectat = (detalii) => {
    console.log('Am selectat din PAAP', detalii)
    linieRN.value.denumire = detalii.rows[0].obiectachizitie_text
    linieRN.value.codcpv = detalii.rows[0].CodCPV
    linieRN.value.idpozPAAP = detalii.rows[0].id
    cantitate_maxima.value = detalii.rows[0].cant_ramasa
  }
  
  const adaugLinieRN = () => {
    liniiRN.value.push({
      idpozPAAP: linieRN.value.idpozPAAP,
      denumire: linieRN.value.denumire,
      codcpv: linieRN.value.codcpv,
      detalii_tehnice: linieRN.value.detalii_tehnice,
      cantitate: linieRN.value.cantitate,
      pret: linieRN.value.pret,
      valoare: valoareLinieRN.value
    })
    
    resetLinieRN()
  }
  
  const resetLinieRN = () => {
    cantitate_maxima.value = 1
    linieRN.value.denumire = ""
    linieRN.value.codcpv = ""
    linieRN.value.cantitate = 1
    linieRN.value.idpozPAAP = 0
    linieRN.value.pret = 0
    linieRN.value.detalii_tehnice = ""
  }
  
  const removeRow = () => {
    liniiRN.value = liniiRN.value.filter(
      item => item.idpozPAAP !== repere_selectate.value[0]['idpozPAAP']
    )
    repere_selectate.value = []
  }
  
  return {
    data_referat,
    uuid,
    obiect_achizitie,
    justificare,
    cantitate_maxima,
    linieRN,
    liniiRN,
    repere_selectate,
    pagination_repere,
    columns,
    valoareLinieRN,
    cantitateValida,
    informatiiComplete,
    documentValid,
    valoaretotala,
    pozPAAPSelectat,
    adaugLinieRN,
    resetLinieRN,
    removeRow
  }
}