<template>
  <q-select 
    clearable
    filled
    use-input
    hide-selected
    fill-input
    dense
    input-debounce="0"
    style="min-width:200px;padding-bottom: 16px"
    hint="Tasteaza primele 2 caractere din cod"
    v-model="model" 
    :options="filteredOptions"
    @filter="filterFn"
    @update:model-value="amSelectat"
    label="Cod CPV"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
      >
        <q-item-section>
          <q-item-label v-html="scope.opt.label" />
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nu am gasit niciun cod...
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../../stores/user'

// Store
const userStore = useUserStore()

// Emits
const emit = defineEmits(['selectie-coloana'])

// Reactive data
const model = ref(null)
const allOptions = ref([])
const filteredOptions = ref([])

// Methods
const filterFn = (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = allOptions.value.filter(v => 
      v.label.toLowerCase().indexOf(needle) > -1
    )
  })
}

const amSelectat = (value) => {
  console.log('Codul selectat...', value)
  if (value) {
    emit('selectie-coloana', {
      cimp: 'id_cod_cpv',
      ce: 'CodCPV',
      valoare: value
    })
  }
}

// Lifecycle
onMounted(async () => {
  const token = userStore.akytoken
  
  try {
    const res = await axios.get(
      process.env.API_URL + 'paap/toatecodurilecpv',
      { headers: { "Authorization": `Bearer ${token}` } }
    )
    
    console.log('Raspuns la toate codurile', res.data)
    
    allOptions.value = res.data.coduri.map(c => ({
      id: c.IDCod,
      label: c.CodCPV,
      value: c.IDCod,
      description: c.descriere
    }))
    
    // Initially show all options
    filteredOptions.value = [...allOptions.value]
  } catch (err) {
    console.error('Error loading CPV codes:', err)
  }
})
</script>

<style>

</style>