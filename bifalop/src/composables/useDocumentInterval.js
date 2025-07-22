import { ref } from 'vue'
import axios from 'axios'
import { date, useQuasar } from 'quasar'
import { useStore } from 'vuex'

export function useDocumentInterval() {
  const $q = useQuasar()
  const store = useStore()
  const listadocumente = ref([])
  
  const fetchDocumentsInInterval = async (datainceput, datasfirsit, idgest) => {
    const token = store.getters.token
    
    try {
      const response = await axios.post(
        process.env.host + 'documente/documenteinterval',
        {
          inceput: datainceput,
          sfirsit: datasfirsit,
          idgestiune: idgest
        },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      )
      
      // Format dates in response
      const documents = response.data.documente.map(doc => ({
        ...doc,
        data: date.formatDate(doc.data, 'YYYY/MM/DD')
      }))
      
      console.log('Raspuns la documente in interval', response)
      listadocumente.value = documents
      
      return documents
    } catch (err) {
      console.log('Eroare.............', err.response?.data?.message)
      
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: `ATENTIE! ${err.response?.data?.message || 'Eroare necunoscuta'}`
      })
      
      throw err
    }
  }
  
  const generateIntervalReport = async (datainceput, datasfirsit, idgest, numegest) => {
    const token = store.getters.token
    
    try {
      const response = await axios.post(
        process.env.host + 'rapoarte/documenteinterval',
        {
          inceput: datainceput,
          sfirsit: datasfirsit,
          idgestiune: idgest,
          numegest: numegest
        },
        {
          responseType: 'blob',
          headers: { "Authorization": `Bearer ${token}` }
        }
      )
      
      const file = new Blob([response.data], {
        type: "application/pdf"
      })
      
      const newWindow = window.open('/', 'documenteInterval')
      newWindow.onload = () => {
        newWindow.location = URL.createObjectURL(file)
      }
      newWindow.document.title = "Situatie documente in interval"
      
    } catch (err) {
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: 'ATENTIE! Eroare la generarea raportului'
      })
      
      throw err
    }
  }
  
  const openSingleDocumentReport = (id) => {
    window.open(process.env.host + 'rapoarte/undocument/' + id, '_blank')
  }
  
  return {
    listadocumente,
    fetchDocumentsInInterval,
    generateIntervalReport,
    openSingleDocumentReport
  }
}