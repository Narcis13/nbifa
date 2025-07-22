<template>
  <div>
    <div class="row q-pa-sm" style="min-width:600px;">
      <q-table
        dense
        separator="cell"
        :rows="repere"
        :columns="columns"
        :filter="filter"
        selection="single"
        v-model:pagination="pagination"
        v-model:selected="selected"
        no-data-label="Niciun reper!"
        row-key="nrcrt"
      >
        <template v-slot:top>
          <q-btn 
            v-show="selected.length === 1" 
            class="on-right" 
            icon="low_priority" 
            flat 
            dense 
            color="primary" 
            label="Modifica" 
            @click="modRow" 
          />
          <q-btn 
            v-show="selected.length === 1" 
            class="on-right" 
            icon="delete_sweep" 
            flat 
            dense 
            color="primary" 
            label="Sterge" 
            @click="removeRow" 
          />
          <q-space />
          <q-input 
            dense 
            debounce="300" 
            color="primary" 
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:bottom-row>
          <q-tr>
            <q-td style="text-align: right;" colspan="100%">
              Total {{ valoareTotala }} lei
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  repere: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['mod-linie'])

// Reactive data
const filter = ref('')
const selected = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

// Table columns configuration
const columns = ref([
  { name: 'nrcrt', align: 'center', label: 'Nr. crt.', field: 'nrcrt' },
  { name: 'categ', label: 'Categoria', field: 'categ', align: 'left', style: 'width: 180px' },
  {
    name: 'denumire_reper',
    required: true,
    style: 'width: 220px',
    label: 'Denumire reper',
    align: 'left',
    field: 'denumire_reper',
    format: val => `${val}`,
    sortable: true
  },
  { name: 'um', align: 'center', label: 'U/M', field: 'um', sortable: true },
  { name: 'cantitate', label: 'Cantitate', field: 'cantitate', sortable: true, align: 'right' },
  { name: 'pret', label: 'Pret', field: 'pret', align: 'right', style: 'width: 100px' },
  { name: 'valoare', label: 'Valoare', field: 'valoare', align: 'right', style: 'width: 125px' }
])

// Computed properties
const valoareTotala = computed(() => {
  let total = 0
  props.repere.forEach(reper => {
    total += parseFloat(reper.valoare) || 0
  })
  return total.toFixed(4)
})

// Methods
const modRow = () => {
  if (selected.value.length > 0) {
    emit('mod-linie', selected.value[0])
    selected.value = []
  }
}

const removeRow = () => {
  if (selected.value.length > 0) {
    console.log('sterg reper', props.repere, selected.value)
    
    // Find and remove the selected item
    const selectedNrcrt = selected.value[0].nrcrt
    const index = props.repere.findIndex(item => item.nrcrt === selectedNrcrt)
    
    if (index !== -1) {
      props.repere.splice(index, 1)
      
      // Renumber the remaining items
      props.repere.forEach((item, idx) => {
        item.nrcrt = idx + 1
      })
    }
    
    selected.value = []
  }
}
</script>
