<template>
  <q-table
    dense
    separator="cell"
    title="Fisa de cont analitica"
    :rows="setdate"
    :columns="columns"
    v-model:pagination="pagination"
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
    </template>
  </q-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useUserStore } from '../stores/user'

// Store and composables
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
const pagination = ref({
  page: 1,
  rowsPerPage: 12
})

// Table columns definition
const columns = ref([
  { name: 'data', align: 'center', label: 'Data', field: 'data' },
  { name: 'explicatii', label: 'Explicatii', field: 'explicatii', align: 'left' },
  { name: 'um', align: 'center', label: 'UM', field: 'um' },
  { name: 'ci', align: 'right', label: 'Intrari', field: 'ci' },
  { name: 'ce', align: 'right', label: 'Iesiri', field: 'ce' },
  { name: 'cs', align: 'right', label: 'Sold', field: 'cs' },
  { name: 'vi', align: 'right', label: 'Val. intrata', field: 'vi' },
  { name: 've', align: 'right', label: 'Val. iesita', field: 've' },
  { name: 'vs', align: 'right', label: 'Sold', field: 'vs' }
])

// Methods
const raportPrintat = async () => {
  const token = userStore.tokenGetter
  
  try {
    const res = await axios.post(
      process.env.API_URL + 'balante/rapfisacont',
      props.parametrii,
      {
        responseType: 'blob',
        headers: { "Authorization": `Bearer ${token}` }
      }
    )
    
    const file = new Blob([res.data], {
      type: "text/html"
    })
    
    const newWindow = window.open('/', 'fisacont')
    newWindow.onload = () => {
      newWindow.location = URL.createObjectURL(file)
    }
    newWindow.document.title = "Fisa de cont analitica"
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

// Lifecycle
onMounted(() => {
  console.log('Component fisa de cont creat!')
})
</script>