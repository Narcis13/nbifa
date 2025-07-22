<template>
  <q-table
    dense
    separator="cell"
    title="Balanta analitica de gestiune"
    :rows="setdate"
    :filter="filter"
    :columns="columns"
    v-model:pagination="pagination"
    row-key="id"
  >
    <template v-slot:top>
      <q-btn 
        class="on-right" 
        icon="print" 
        flat 
        dense 
        color="green" 
        label="Print" 
        @click="raportPrintat" 
      />
      <q-btn 
        class="on-right" 
        icon="print" 
        flat 
        dense 
        color="blue" 
        label="Lista inventariere" 
        @click="raportLIPrintat" 
      />
      <q-space />
      <q-input dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:bottom-row>
      <q-tr>
        <q-td class="text-bold" style="text-align: right;" colspan="100%">
          Total valoare stoc final: {{ total }} lei
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useUserStore } from '../stores/user'

// Stores and composables
const $q = useQuasar()
const userStore = useUserStore()

// Props
const props = defineProps({
  setdate: {
    type: Array,
    required: true
  },
  total: {
    type: [Number, String],
    default: 0
  },
  parametrii: {
    type: Object,
    required: true
  }
})

// Reactive data
const filter = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: 12
})

// Table columns configuration
const columns = ref([
  { name: 'nrcrt', align: 'center', label: 'Nr. crt.', field: 'nrcrt' },
  { name: 'id', label: 'ID', field: 'id_reper', align: 'left' },
  { name: 'denumire', align: 'left', label: 'Denumire', field: 'denumire' },
  { name: 'um', align: 'center', label: 'UM', field: 'um' },
  { name: 'si', align: 'right', label: 'Stoc initial', field: 'stocinitial' },
  { name: 'int', align: 'right', label: 'Intrari', field: 'ti' },
  { name: 'ies', align: 'right', label: 'Iesiri', field: 'te' },
  { name: 'sf', align: 'right', label: 'Stoc final', field: 'stocfinal' },
  { name: 'vi', align: 'right', label: 'Valoare initiala', field: 'valoarestocinitial' },
  { name: 'debit', align: 'right', label: 'Debit', field: 'vi' },
  { name: 'credit', align: 'right', label: 'Credit', field: 've' },
  { name: 'vf', align: 'right', label: 'Valoare finala', field: 'valoarestoc' }
])

// Methods
const raportLIPrintat = async () => {
  console.log('PRINT LISTA INV!')
  const token = userStore.tokenGetter

  try {
    const res = await axios.post(
      process.env.API_URL + 'balante/rapli',
      props.parametrii,
      {
        responseType: 'blob',
        headers: { "Authorization": `Bearer ${token}` }
      }
    )

    const file = new Blob([res.data], {
      type: "text/html"
    })

    const newWindow = window.open('/', 'rapli')
    newWindow.onload = () => {
      newWindow.location = URL.createObjectURL(file)
    }
    newWindow.document.title = "Lista inventariere"
  } catch (err) {
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! `
    })
  }
}

const raportPrintat = async () => {
  const token = userStore.tokenGetter

  try {
    const res = await axios.post(
      process.env.API_URL + 'balante/rapanalitica',
      props.parametrii,
      {
        responseType: 'blob',
        headers: { "Authorization": `Bearer ${token}` }
      }
    )

    const file = new Blob([res.data], {
      type: "text/html"
    })

    const newWindow = window.open('/', 'balantaanalitica')
    newWindow.onload = () => {
      newWindow.location = URL.createObjectURL(file)
    }
    newWindow.document.title = "Balanta analitica"
  } catch (err) {
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! `
    })
  }
}
</script>

