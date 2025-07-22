<template>
  <div>
    <q-list padding class="text-primary" style="width:230px">
      <q-item-label v-if="isAdmin" header>Administrare</q-item-label>
      
      <q-item
        clickable
        v-if="isAdmin"
        v-ripple
        :active="link === 'inbox'"
        @click="clickUtilizatori"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="contacts" />
        </q-item-section>
        <q-item-section>Utilizatori</q-item-section>
      </q-item>

      <q-item
        clickable
        v-if="isAdmin"
        v-ripple
        :active="link === 'outbox'"
        @click="clickGestiuni"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="list_alt" />
        </q-item-section>
        <q-item-section>Gestiuni</q-item-section>
      </q-item>

      <q-item
        clickable
        v-if="isAdmin"
        v-ripple
        :active="link === 'conturi'"
        @click="clickConturi"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="sort" />
        </q-item-section>
        <q-item-section>Plan Conturi</q-item-section>
      </q-item>

      <q-item
        clickable
        v-if="isAdmin"
        v-ripple
        :active="link === 'trash'"
        @click="clickCategorii"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="ballot" />
        </q-item-section>
        <q-item-section>Categorii repere</q-item-section>
      </q-item>
      
      <q-item
        clickable
        v-if="isAdmin"
        v-ripple
        :active="link === 'setari'"
        @click="clickSetari"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="settings_applications" />
        </q-item-section>
        <q-item-section>Configurare aplicatie</q-item-section>
      </q-item>
      
      <q-separator v-if="esteLogat" spaced />
      
      <q-item-label v-if="esteLogat" header>Nomenclatoare</q-item-label>
      
      <q-item
        clickable
        v-if="esteLogat"
        v-ripple
        :active="link === 'locuri'"
        @click="clickLocuri"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="library_books" />
        </q-item-section>
        <q-item-section>Locuri de dispunere</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        v-if="esteLogat"
        :active="link === 'materiale'"
        @click="clickMateriale"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="dns" />
        </q-item-section>
        <q-item-section>Materiale</q-item-section>
      </q-item>

      <q-separator spaced />
      
      <q-item-label header>Operatiuni</q-item-label>
      
      <q-item
        clickable
        v-if="esteLogat"
        v-ripple
        :active="link === 'operatiunenoua'"
        @click="clickDocNou"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="note_add" />
        </q-item-section>
        <q-item-section>Operatiune noua...</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        :active="link === 'rap'"
        @click="clickRapoarte"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="assignment" />
        </q-item-section>
        <q-item-section>Rapoarte</q-item-section>
      </q-item>
    </q-list>
    
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar 
            icon="signal_wifi_off" 
            color="primary" 
            text-color="white" 
          />
          <span class="q-ml-sm">
            Aveti un document in lucru! Renuntati la document si pierdeti datele introduse?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="DA" 
            @click="abandoneazaSiMergiMaiDeparte" 
            color="primary" 
            v-close-popup 
          />
          <q-btn 
            flat 
            label="NU" 
            color="primary" 
            v-close-popup 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useNavigation } from '../composables/useNavigation'
import { usePermissions } from '../composables/usePermissions'

const props = defineProps({
  rol: {
    type: String,
    default: ''
  },
  logat: {
    type: Boolean,
    default: false
  }
})

// Use composables
const {
  link,
  ruta,
  confirm,
  ok,
  inLucru,
  abandoneazaSiMergiMaiDeparte,
  clickUtilizatori,
  clickIntrari,
  clickLocuri,
  clickDocNou,
  clickMateriale,
  clickGestiuni,
  clickConturi,
  clickSetari,
  clickCategorii,
  clickRapoarte
} = useNavigation()

const { isAdmin, esteLogat } = usePermissions(props.rol, props.logat)
</script>

<style scoped>
.my-menu-link {
  color: white;
  background: #F2C037;
}
</style>