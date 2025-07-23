import { ref, computed } from 'vue'
import { date, Notify } from 'quasar'
import axios from 'axios'
import { useStore } from 'vuex'

export function useDocuments() {
  const store = useStore()
  
  const documente = ref([])
  const documenteselectate = ref([])
  const tipuridocumente = ref([])
  const tipdocument = ref(null)
  const nrdoc = ref(' ')
  const datadoc = ref(null)
  const repere = ref([])
  const modMOD = ref(false)
  const modMODREPER = ref(-1)
  const filter = ref('')
  
  const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 10
  })
  
  const columns = [
    { name: 'id', field: 'id' },
    { name: 'tipoperatiune', align: 'left', label: 'Tip document', field: 'tipoperatiune', sortable: true },
    { name: 'data', label: 'Data document', field: 'data', sortable: true, format: (val) => date.formatDate(val, 'DD/MM/YYYY') },
    { name: 'nrdoc', label: 'Numar document', field: 'nrdoc' },
    { name: 'debit', label: 'DEBIT', field: 'debit', format: (val) => parseFloat(val).toFixed(2) },
    { name: 'credit', label: 'CREDIT', field: 'credit', format: (val) => parseFloat(val).toFixed(2) },
    { name: 'datamodificare', label: 'Ultima modificare', field: 'datamodificare', format: (val) => date.formatDate(val, 'DD/MM/YYYY HH:mm') }
  ]
  
  const totaldebit = computed(() => {
    let t = 0
    documente.value.map(d => {
      t += parseFloat(d.debit)
    })
    return t.toFixed(2)
  })
  
  const totalcredit = computed(() => {
    let t = 0
    documente.value.map(d => {
      t += parseFloat(d.credit)
    })
    return t.toFixed(2)
  })
  
  const lblPrint = computed(() => {
    return documenteselectate.value.length === 0 ? 'Printeaza toate' : 'Printeaza'
  })
  
  const PotAdaugaDocument = computed(() => {
    return repere.value.length > 0 && nrdoc.value.length > 1
  })
  
  const intrarivizibile = computed(() => {
    return tipdocument.value?.tip === 'i' || tipdocument.value?.tip === 't'
  })
  
  const iesirivizibile = computed(() => {
    return tipdocument.value?.tip === 'e' || tipdocument.value?.tip === 't'
  })
  
  const eTransfer = computed(() => {
    return tipdocument.value?.tip === 't'
  })
  
  const initializareTipuriDocumente = async () => {
    try {
      const token = store.getters.token
      const response = await axios.get(
        `${process.env.host}documente/tipuridocumente`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      tipuridocumente.value = response.data.tipuridocs.map(td => ({
        id: td.id,
        label: td.denumire,
        value: td.id,
        tip: td.tip,
        scurta: td.denumire_scurta
      }))
      
      if (tipuridocumente.value.length > 0) {
        tipdocument.value = tipuridocumente.value[0]
      }
    } catch (error) {
      console.error('Eroare la incarcarea tipurilor de documente:', error)
    }
  }
  
  const newData = (data) => {
    documente.value = [...data]
    for (let i = 0; i < documente.value.length; i++) {
      if (documente.value[i].debit == documente.value[i].credit) {
        documente.value[i].valoare = parseFloat(documente.value[i].debit).toFixed(2)
        documente.value[i].icon = 'refresh'
      } else if (documente.value[i].debit > 0) {
        documente.value[i].valoare = parseFloat(documente.value[i].debit).toFixed(2)
        documente.value[i].icon = 'subdirectory_arrow_right'
      } else {
        documente.value[i].valoare = parseFloat(documente.value[i].credit).toFixed(2)
        documente.value[i].icon = 'subdirectory_arrow_left'
      }
    }
  }
  
  const salveazaDocument = async () => {
    try {
      const token = store.getters.token
      const tip = tipdocument.value.tip
      const data = date.extractDate(datadoc.value, 'DD/MM/YYYY')
      const datacorecta = date.formatDate(data, 'YYYY-MM-DD')
      
      const response = await axios.post(
        `${process.env.host}documente/documentnou`,
        {
          idtipoperatiuni: tipdocument.value.id,
          tipoperatiune: tipdocument.value.scurta,
          data: datacorecta,
          nrdoc: nrdoc.value,
          idgestiune: store.getters.gestiuneCurenta.id,
          stare: 'ACTIV'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const antet = response.data
      let tranzactii = [...repere.value]
      tranzactii.map(t => {
        t.idAntet = response.data.id
        t.id_gestiune = store.getters.gestiuneCurenta.id
      })
      
      await axios.post(
        `${process.env.host}documente/tranzactienoua`,
        {
          tranzactii,
          desters: modMOD.value ? documenteselectate.value[0].id : -1
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      Notify.create({
        message: 'Tranzactia a fost adaugata cu succes!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      let val = 0
      repere.value.map(r => {
        val += parseFloat(r.valoare)
      })
      
      repere.value = []
      
      const iconText = tip === 't' ? 'refresh' : (tip === 'i') ? 'subdirectory_arrow_right' : 'subdirectory_arrow_left'
      documente.value.push({
        id: antet.id,
        idtipoperatiuni: tipdocument.value.id,
        tipoperatiune: tipdocument.value.scurta,
        data: datacorecta,
        nrdoc: nrdoc.value,
        idgestiune: store.getters.gestiuneCurenta.id,
        valoare: val,
        icon: iconText,
        stare: 'ACTIV'
      })
      
      resetDocument()
      
    } catch (error) {
      console.error('Eroare la salvarea documentului:', error)
      Notify.create({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: 'ATENTIE! Eroare la salvarea documentului'
      })
    }
  }
  
  const modificaDocument = async () => {
    try {
      const token = store.getters.token
      const docSelectat = documenteselectate.value[0]
      
      const eTransfer = (docSelectat.debit == docSelectat.credit)
      const eIntrare = (docSelectat.debit > docSelectat.credit)
      const tip = eTransfer ? 't' : eIntrare ? 'i' : 'e'
      
      const response = await axios.get(
        `${process.env.host}documente/modificdocument/${docSelectat.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      repere.value = []
      const resdatadoc = eTransfer 
        ? response.data.doc.filter((item, index) => index % 2 === 0)
        : [...response.data.doc]
      
      for (let i = 0; i < resdatadoc.length; i++) {
        const obj = {
          nrcrt: i + 1,
          categ: resdatadoc[i].categorie,
          id_categ: resdatadoc[i].id_categ,
          denumire_reper: resdatadoc[i].material,
          id_reper: resdatadoc[i].id_material,
          um: resdatadoc[i].um,
          cantitate: parseFloat(resdatadoc[i].cantitate_debit) + parseFloat(resdatadoc[i].cantitate_credit),
          pret: parseFloat(resdatadoc[i].pret).toFixed(2),
          valoare: parseFloat(resdatadoc[i].debit) + parseFloat(resdatadoc[i].credit),
          tipmaterial: resdatadoc[i].tip_material,
          id_locintrare: eTransfer ? response.data.doc[2 * i + 1].id_locdispunere : eIntrare ? resdatadoc[i].id_locdispunere : null,
          id_lociesire: eTransfer ? response.data.doc[2 * i].id_locdispunere : eIntrare ? null : resdatadoc[i].id_locdispunere,
          id_categ_intrare: eTransfer ? response.data.doc[2 * i + 1].id_categ : eIntrare ? resdatadoc[i].id_categ : null,
          id_categ_iesire: eTransfer ? response.data.doc[2 * i].id_categ : eIntrare ? null : resdatadoc[i].id_categ,
          stare_material_intrare: eTransfer ? response.data.doc[2 * i + 1].stare_material : eIntrare ? resdatadoc[i].stare_material : null,
          stare_material_iesire: eTransfer ? response.data.doc[2 * i].stare_material : eIntrare ? null : resdatadoc[i].stare_material,
          tip
        }
        repere.value.push(obj)
      }
      
      tipuridocumente.value.map(item => {
        if (item.scurta === resdatadoc[0].tipoperatiune) {
          tipdocument.value = item
        }
      })
      
      nrdoc.value = resdatadoc[0].nrdoc
      datadoc.value = date.formatDate(resdatadoc[0].data, 'DD/MM/YYYY')
      modMOD.value = true
      
    } catch (error) {
      console.error('Eroare la modificarea documentului:', error)
    }
  }
  
  const stergeDocument = async () => {
    try {
      const token = store.getters.token
      
      if (documenteselectate.value.length !== 1) {
        Notify.create({
          color: 'negative',
          timeout: 1500,
          position: 'top',
          icon: 'delete',
          message: 'Selectati un document'
        })
        return
      }
      
      await axios.patch(
        `${process.env.host}documente/${documenteselectate.value[0].id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      documente.value.some((item, index) => {
        return (documente.value[index].id === documenteselectate.value[0].id) 
          ? !!(documente.value.splice(index, 1)) 
          : false
      })
      
      Notify.create({
        message: 'Documentul selectat a fost invalidat!',
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
    } catch (error) {
      console.error('Eroare la stergerea documentului:', error)
    }
  }
  
  const resetDocument = () => {
    repere.value = []
    nrdoc.value = ' '
    modMOD.value = false
    modMODREPER.value = -1
    documenteselectate.value = []
    if (tipuridocumente.value.length > 0) {
      tipdocument.value = tipuridocumente.value[0]
    }
  }
  
  const initializareData = () => {
    const timeStamp = Date.now()
    datadoc.value = date.formatDate(timeStamp, 'DD/MM/YYYY')
  }
  
  return {
    documente,
    documenteselectate,
    tipuridocumente,
    tipdocument,
    nrdoc,
    datadoc,
    repere,
    modMOD,
    modMODREPER,
    filter,
    pagination,
    columns,
    totaldebit,
    totalcredit,
    lblPrint,
    PotAdaugaDocument,
    intrarivizibile,
    iesirivizibile,
    eTransfer,
    initializareTipuriDocumente,
    newData,
    salveazaDocument,
    modificaDocument,
    stergeDocument,
    resetDocument,
    initializareData
  }
}