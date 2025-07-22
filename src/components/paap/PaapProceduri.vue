<template>
  <q-select 
    style="min-width:200px;" 
    @update:model-value="amSelectat" 
    v-model="model" 
    :options="options" 
    label="Proceduri" 
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../../stores/user'

// Store
const userStore = useUserStore()

// Props
const props = defineProps(['selectie'])

// Emits
const emit = defineEmits(['selectie-coloana'])

// Reactive data
const model = ref(null)
const options = ref([])

// Methods
const amSelectat = (value) => {
  if (value) {
    emit('selectie-coloana', {
      cimp: 'id_procedura',
      ce: 'procedura',
      valoare: value
    })
  }
}

// Lifecycle
onMounted(async () => {
  const token = userStore.akytoken
  try {
    const res = await axios.get(process.env.API_URL + 'paap/toateprocedurile', {
      headers: { "Authorization": `Bearer ${token}` }
    })
    console.log('Raspuns la toate procedurile', res.data)
    
    options.value = res.data.proceduri.map(p => ({
      id: p.id,
      label: p.procedura,
      value: p.id
    }))
  } catch (err) {
    console.error('Error loading proceduri:', err)
  }
})
</script>

<style>

</style>