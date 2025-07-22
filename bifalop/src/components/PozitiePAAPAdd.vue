<template>
  <q-card style="width: 640px; max-width: 80vw;">
    <q-card-section>
      <div class="text-h6">Pozitie noua PAAP</div>
    </q-card-section>

    <q-card-section class="q-pt-none q-pa-md">
      <div class="row q-gutter-md">
        <div class="col">
          <q-input 
            v-model="pozitie.obiect_achizitie" 
            label="Obiect achizitie" 
            autogrow 
            outlined 
          />
        </div>

        <div class="col">
          <cod-cpv @selectie-coloana="coloanaSelectata" />
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xs">
        <div class="col">
          <q-input 
            v-model.number="pozitie.cantitate" 
            type="number" 
            outlined 
            label="Cantitate" 
          />
        </div>

        <div class="col">
          <q-input 
            v-model.number="pozitie.valoare" 
            type="number" 
            outlined 
            label="Valoare" 
          />
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xs">
        <div class="col">
          <proceduri @selectie-coloana="coloanaSelectata" />
        </div>

        <div class="col">
          <q-input 
            v-model="pozitie.responsabil" 
            outlined 
            label="Responsabil" 
          />
        </div>
      </div>

      <div class="row q-gutter-md q-mt-xs">
        <div class="col">
          <articole-bugetare @selectie-coloana="coloanaSelectata" />
        </div>

        <div class="col">
          <compartimente 
            v-show="DeLaAchizitii" 
            @selectie-coloana="coloanaSelectata" 
          />
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn flat label="Abandon" v-close-popup />
      <q-space />
      <q-btn 
        flat 
        label="ADAUGA" 
        :disable="!ToateCompletate" 
        @click="adauga" 
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { usePaapPozitie } from '../composables/usePaapPozitie'

import PaapCodCPV from '../../../src/components/paap/PaapCodCPV.vue'
import PaapProceduri from '../../../src/components/paap/PaapProceduri.vue'
import PaapArticolBugetar from '../../../src/components/paap/PaapArticolBugetar.vue'
import PaapCompartimente from '../../../src/components/paap/PaapCompartimente.vue'

const props = defineProps({
  anplan: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['pozitie-adaugata'])

const {
  pozitie,
  DeLaAchizitii,
  ToateCompletate,
  updateField,
  adaugaPozitie
} = usePaapPozitie(props.anplan)

console.log('Componentul PozitiePAAPAdd a fost creat !', props.anplan)

const coloanaSelectata = (v) => {
  console.log('Am selectat', v)
  updateField(v.cimp, v.valoare.value)
}

const adauga = async () => {
  console.log('Adaug pozitie', pozitie.value)
  
  const result = await adaugaPozitie()
  
  if (result.success) {
    emit('pozitie-adaugata', {})
    console.log("emit('pozitie-adaugata', {})")
  }
}
</script>

<style scoped>
</style>