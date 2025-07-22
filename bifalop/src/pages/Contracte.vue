<template>
  <q-page padding>
    <div class="row justify-center">
      Contracte
    </div>

    <q-dialog 
      v-model="adaug_contract" 
      persistent 
      transition-show="scale" 
      transition-hide="scale"
    >
      <contracte-noi />
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn 
        fab 
        icon="add" 
        color="accent" 
        @click="adaug_contract = true" 
      />
    </q-page-sticky>
    
    <q-page-sticky position="bottom-left" :offset="[24, 24]">
      <q-btn 
        fab 
        icon="settings_backup_restore" 
        color="accent" 
        @click="goToDashboard" 
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ContracteNoi from '../components/ContracteNoi.vue'

const router = useRouter()
const adaug_contract = ref(false)

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style>
</style>