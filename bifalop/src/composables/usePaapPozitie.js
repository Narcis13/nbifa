import { ref, computed } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export function usePaapPozitie(anplan) {
  const $q = useQuasar()
  const store = useStore()
  
  const pozitie = ref({
    obiect_achizitie: '',
    cantitate: 0,
    valoare: 0,
    responsabil: '',
    id_cod_cpv: 0,
    id_procedura: 0,
    id_compartiment: store.getters.idcompartimentakyuserlogat,
    artbug: '',
    anplan: parseInt(anplan)
  })

  const DeLaAchizitii = computed(() => {
    return store.getters.akyroluserlogat === "Achizitii"
  })

  const ToateCompletate = computed(() => {
    return pozitie.value.obiect_achizitie !== '' &&
           pozitie.value.responsabil !== '' &&
           pozitie.value.artbug !== '' &&
           pozitie.value.id_cod_cpv > 0 &&
           pozitie.value.id_procedura > 0 &&
           pozitie.value.id_compartiment > 0
  })

  const updateField = (field, value) => {
    pozitie.value[field] = value
  }

  const adaugaPozitie = async () => {
    const token = store.getters.token
    
    try {
      const response = await axios.post(process.env.host + 'paap/pozitienoua', pozitie.value, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      console.log('raspuns insert pozitie noua', response)
      
      $q.notify({
        message: 'Pozitie adaugata cu succes!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      return { success: true, data: response.data }
    } catch (err) {
      console.log('Eroare.............', err.response?.data?.message)
      
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: `ATENTIE! ${err.response?.data?.message || 'Eroare necunoscuta'}`
      })
      
      return { success: false, error: err }
    }
  }

  return {
    pozitie,
    DeLaAchizitii,
    ToateCompletate,
    updateField,
    adaugaPozitie
  }
}