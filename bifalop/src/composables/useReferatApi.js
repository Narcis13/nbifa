import axios from 'axios'
import { date, useQuasar } from 'quasar'
import { useStore } from 'vuex'

export function useReferatApi() {
  const $q = useQuasar()
  const store = useStore()
  
  const salveazaReferat = async (formData) => {
    const token = store.getters.akytoken
    const id_compartiment = store.getters.idcompartimentakyuserlogat
    
    // Format date
    const data = date.extractDate(formData.data_referat, 'YYYY/MM/DD')
    const datacorecta = date.formatDate(data, 'YYYY-MM-DD')
    
    console.log('Data doc', datacorecta, id_compartiment)
    
    try {
      // Save header
      const antetResponse = await axios.post(
        process.env.host + 'rn/antetnou',
        {
          data: datacorecta,
          obiect_achizitie: formData.obiect_achizitie,
          valoare: formData.valoaretotala,
          justificare: formData.justificare,
          id_compartiment: id_compartiment
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      )
      
      console.log('Raspuns de la antet nou', antetResponse.data)
      
      // Save details
      const detaliiResponse = await axios.post(
        process.env.host + 'rn/detaliinoi',
        {
          tranzactii: formData.liniiRN,
          idAntet: antetResponse.data.id
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      )
      
      $q.notify({
        message: 'Referat necesitate adaugat cu succes!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      console.log('ajung fix aici inainte de a emite event referat-nou')
      
      return { 
        success: true, 
        data: detaliiResponse.data 
      }
      
    } catch (err) {
      console.log('Eroare.............', err)
      
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: 'ATENTIE! Eroare la salvarea referatului'
      })
      
      return { 
        success: false, 
        error: err 
      }
    }
  }
  
  return {
    salveazaReferat
  }
}