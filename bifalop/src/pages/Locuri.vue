<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width:300px">
      <q-list bordered separator>
        <q-slide-item 
          v-for="l in locuri" 
          :key="l.id" 
          @left="onLeft(l.id, $event)" 
          @right="onRight" 
          left-color="red"
        >
          <template v-slot:left>
            <div class="row items-center">
              <q-icon left name="delete" /> Sterge!
            </div>
          </template>

          <q-item>
            <q-item-section>{{ l.denumire }}</q-item-section>
            <q-item-section v-if="l.nou" side>
              <q-badge color="orange" text-color="black" label="NOU!" />
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-list>
      
      <q-btn
        round
        color="primary"
        class="fixed"
        icon="add"
        style="right: 48px; bottom: 64px"
      >
        <q-popup-edit 
          v-model="numenou" 
          content-class="bg-accent text-white" 
          buttons 
          @save="adaugaLoc"
        >
          <q-input 
            dark 
            color="white" 
            v-model="numenou" 
            dense 
            autofocus 
            counter
          >
            <template v-slot:append>
              <q-icon name="edit" />
            </template>
          </q-input>
        </q-popup-edit>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLocuriCrud } from '../composables/useLocuriCrud'

const {
  locuri,
  numenou,
  loadLocuri,
  adaugaLoc,
  onLeft,
  onRight
} = useLocuriCrud()

onMounted(() => {
  loadLocuri()
})
</script>