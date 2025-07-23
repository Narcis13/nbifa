import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import axios from 'axios'

function removeByKey(array, params) {
  array.some(function(item, index) {
    return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false
  })
  return array
}

export function usePaapActions() {
  const store = useStore()
  const $q = useQuasar()

  const stergeSelectie = async (selected, paap) => {
    let iduri = []
    let fromuri = []
    
    selected.value.map(el => {
      iduri.push(el.id)
      fromuri.push(el.from)
    })
    
    console.log('sterg ', iduri)
    const token = store.getters.token
    const id = 999
    
    try {
      await axios.put(`${process.env.host}paap/invalideazapozitieplan/${id}`, {
        iduri,
        fromuri
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      $q.notify({
        message: 'Stergere reusita!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      iduri.map(id => {
        paap.value = removeByKey(paap.value, { key: 'id', value: id })
      })
      
      selected.value = []
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const cloneazaSelectie = async (selected) => {
    let iduri = []
    selected.value.map(el => iduri.push(el.id))
    
    console.log('clonez ', selected.value)
    const token = store.getters.token
    
    try {
      await axios.post(`${process.env.host}paap/cloneazapozitii`, {
        tranzactii: selected.value
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      $q.notify({
        message: 'Clonare pozitii PAAP reusita!',
        timeout: 2000,
        position: 'top',
        color: 'positive'
      })

      selected.value = []
    } catch (err) {
      console.error('Clone error:', err)
    }
  }

  return {
    stergeSelectie,
    cloneazaSelectie
  }
}