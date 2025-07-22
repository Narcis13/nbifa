<template>
  <q-input 
    clearable 
    @update:model-value="amScris" 
    debounce="1000" 
    filled 
    style="min-width:200px;" 
    v-model="model"  
    label="Responsabil" 
  />
</template>

<script setup>
import { ref } from 'vue'

// Define emits
const emit = defineEmits(['selectie-coloana'])

// Reactive data
const model = ref(null)

// Methods
const amScris = (value) => {
  emit('selectie-coloana', {
    cimp: 'responsabil',
    ce: 'responsabil',
    valoare: { label: value, value: value }
  })
  console.log('Responsabil nou', { label: value, value: value })
}
</script>

<style>

</style>