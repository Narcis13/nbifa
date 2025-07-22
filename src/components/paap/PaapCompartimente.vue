<template>
  <q-select 
    style="min-width:200px;" 
    @update:model-value="amSelectat" 
    dense 
    v-model="model" 
    :options="options" 
    label="Compartimente" 
  />
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
const options = ref([])

// Methods
const amSelectat = (value) => {
  if (value) {
    emit('selectie-coloana', {
      cimp: 'id_compartiment',
      ce: 'denumire',
      valoare: { label: value.label, value: value.value }
    })
  }
}

// Lifecycle
onMounted(async () => {
  const token = userStore.akytoken
  try {
    const res = await axios.get(process.env.API_URL + 'paap/toatecompartimentele', {
      headers: { "Authorization": `Bearer ${token}` }
    })
    console.log('Raspuns la toate compartimentele', res.data)
    
    options.value = res.data.compartimente.map(c => ({
      id: c.id,
      label: c.denumire,
      value: c.id
    }))
  } catch (err) {
    console.error('Error loading compartimente:', err)
  }
})
</script>

<style>

</style>