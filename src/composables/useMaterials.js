import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import { useStore } from 'vuex'

export function useMaterials() {
  const store = useStore()
  
  const materiale = ref([])
  const materialeintrare = ref([])
  const materialeiesire = ref([])
  const materialintrare = ref(null)
  const materialiesire = ref(null)
  const cantitate = ref(1)
  const cantitate_maxima = ref(999999999)
  const pretunitar = ref(0)
  const um = ref('buc')
  const categorii = ref([])
  const categoriei = ref(null)
  const categoriee = ref(null)
  const staremateriali = ref('NOU')
  const staremateriale = ref('NOU')
  const tipmaterial = ref({ label: 'MATERIALE', value: 'M' })
  
  const tipurirepere = [
    { label: 'MATERIALE', value: 'M' },
    { label: 'OBIECTE INVENTAR', value: 'OB' },
    { label: 'MIJLOACE FIXE', value: 'MF' }
  ]
  
  const starimaterial = ['NOU', 'FOLOSIT', 'CASARE']
  
  const cantitateValida = computed(() => {
    return cantitate.value !== '' && cantitate.value > 0 && cantitate.value <= cantitate_maxima.value
  })
  
  const valoareunitara = computed(() => {
    return 'Valoare: ' + (pretunitar.value * cantitate.value).toFixed(4)
  })
  
  const doarvaloare = computed(() => {
    return (pretunitar.value * cantitate.value).toFixed(4)
  })
  
  const PotAdaugaReper = computed(() => {
    return (categoriei.value || categoriee.value) && 
           (materialintrare.value || materialiesire.value) && 
           cantitate.value > 0 && 
           cantitate.value <= cantitate_maxima.value
  })
  
  const initializareMateriale = async () => {
    try {
      const token = store.getters.token
      const response = await axios.get(
        `${process.env.host}materiale/toate/${store.getters.gestiuneCurenta.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      materialeintrare.value = []
      materialeiesire.value = []
      materiale.value = []
      
      response.data.materiale.map(m => {
        const materialObj = {
          id: m.id,
          label: m.denumire,
          value: m.id,
          cod: m.cod_import,
          um: m.um,
          pretpredefinit: m.pretpredefinit,
          stoc: 9999
        }
        
        materialeintrare.value.push(materialObj)
        materialeiesire.value.push(materialObj)
        materiale.value.push(materialObj)
      })
      
    } catch (error) {
      console.error('Eroare la incarcarea materialelor:', error)
    }
  }
  
  const categoriiPerGestiunePerTip = async () => {
    try {
      const token = store.getters.token
      const response = await axios.get(
        `${process.env.host}categ/categoriilegestiunii/${store.getters.gestiuneCurenta.id}/${tipmaterial.value.value}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      categorii.value = []
      response.data.categorii.map(c => {
        categorii.value.push({
          id: c.id,
          label: c.denumire,
          value: c.id
        })
      })
      
    } catch (error) {
      console.error('Eroare la incarcarea categoriilor:', error)
    }
  }
  
  const materialIntrareSelectat = (value) => {
    if (value) {
      um.value = value.um
      pretunitar.value = value.pretpredefinit
    }
  }
  
  const materialIesireSelectat = (value) => {
    if (value) {
      um.value = value.um
      pretunitar.value = value.pretpredefinit
      cantitate_maxima.value = value.stoc
      cantitate.value = value.stoc
    }
  }
  
  const schimbTipMaterial = () => {
    categoriiPerGestiunePerTip()
    resetMateriale()
  }
  
  const selectezCategorieIesire = async (lociesire) => {
    try {
      const token = store.getters.token
      const response = await axios.post(
        `${process.env.host}documente/stocpretmediu`,
        {
          id_categ: categoriee.value.id,
          idgestiune: store.getters.gestiuneCurenta.id,
          idloc: lociesire.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      materiale.value = []
      response.data.stocuri[0].map(s => {
        materiale.value.push({
          id: s.id_reper,
          label: s.denumire,
          value: s.id_reper,
          um: s.um,
          cod: s.cod_import,
          pretpredefinit: parseFloat(s.pretmediu).toFixed(4),
          stoc: s.stoc,
          stare: s.stare_material
        })
      })
      
    } catch (error) {
      console.error('Eroare la selectarea categoriei de iesire:', error)
      Notify.create({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: 'ATENTIE! Eroare la incarcarea stocurilor'
      })
    }
  }
  
  const materialAdaugat = (materialNou) => {
    const mat_nou = {
      id: materialNou.id,
      label: materialNou.denumire,
      value: materialNou.id,
      um: materialNou.um,
      cod: materialNou.cod_import,
      pretpredefinit: materialNou.pretpredefinit
    }
    
    materialeintrare.value.push(mat_nou)
    materiale.value.push(mat_nou)
    materialintrare.value = mat_nou
  }
  
  const filterMaterialeIntrare = (val, locuri) => {
    if (val.length < 2) {
      return materiale.value
    }
    const needle = val.toLowerCase()
    return materiale.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  }
  
  const filterMaterialeIesire = (val, locuri) => {
    if (val.length < 2) {
      return materiale.value
    }
    const needle = val.toLowerCase()
    return materiale.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  }
  
  const resetMateriale = () => {
    cantitate.value = 1
    pretunitar.value = 0
    materialintrare.value = null
    materialiesire.value = null
  }
  
  const resetCategoriiStare = () => {
    staremateriali.value = 'NOU'
    staremateriale.value = 'NOU'
    categoriei.value = null
    categoriee.value = null
  }
  
  return {
    materiale,
    materialeintrare,
    materialeiesire,
    materialintrare,
    materialiesire,
    cantitate,
    cantitate_maxima,
    pretunitar,
    um,
    categorii,
    categoriei,
    categoriee,
    staremateriali,
    staremateriale,
    tipmaterial,
    tipurirepere,
    starimaterial,
    cantitateValida,
    valoareunitara,
    doarvaloare,
    PotAdaugaReper,
    initializareMateriale,
    categoriiPerGestiunePerTip,
    materialIntrareSelectat,
    materialIesireSelectat,
    schimbTipMaterial,
    selectezCategorieIesire,
    materialAdaugat,
    filterMaterialeIntrare,
    filterMaterialeIesire,
    resetMateriale,
    resetCategoriiStare
  }
}