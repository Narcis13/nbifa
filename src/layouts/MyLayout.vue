<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="left = !left"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          BIFA Gestiune vers. 1.0 
          
        </q-toolbar-title>
        <q-btn v-if="!userAutentificat" icon="lock" flat dense @click="doLogin">Autentificare!</q-btn>
              <q-btn-dropdown
                  class="glossy"
                  color="purple"
                  v-if="userAutentificat"
                  :label="numeUtilizator+' '+gestiuneaCurenta"
                  @input="actUser"
                >
                  <div class="row no-wrap q-pa-md">
                    <div class="column">
                      <div class="text-h6 q-mb-md">Gestiuni operate</div>
                        <q-option-group
                          v-model="group"
                          :options="gestiuni"
                          color="primary"
                        />
                    </div>

                    <q-separator vertical inset class="q-mx-lg" />

                    <div class="column items-center">
                      <q-avatar size="72px">
                        <img src="~assets/user.svg">
                      </q-avatar>

                      <div class="text-subtitle1 q-mt-md q-mb-xs">{{numeUtilizator}} {{gestiuneaCurenta}}</div>

                      <q-btn
                        color="primary"
                        label="Inchide"
                        push
                        size="sm"
                        @click="inchideUser"
                        v-close-popup
                      />
                    </div>
                  </div>
                </q-btn-dropdown>
        <q-btn  v-if="userAutentificat" icon="backspace" flat  @click="doLogout"> Iesire!</q-btn>
      </q-toolbar>
    </q-header>

   <q-drawer :width="230" v-model="left" side="left" bordered>
    <Meniu :rol="rolUtilizator" :logat="userAutentificat"/>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>Din pasiune de: Narcis Brindusescu </q-toolbar-title>
        </q-toolbar>     
      </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, openURL } from 'quasar'
import { useUserStore } from '../stores/user'
import { useEventsStore } from '../stores/events'
import Meniu from '../components/Meniu.vue'

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()
const eventsStore = useEventsStore()

// Reactive data
const left = ref($q.platform.is.desktop)
const group = ref('op1')
const gestiune = ref({ id: 0, denumire: '' })

// Computed properties
const userAutentificat = computed(() => {
  return userStore.user !== null && userStore.user !== undefined
})

const numeUtilizator = computed(() => {
  return userStore.userGetter
})

const rolUtilizator = computed(() => {
  return userStore.rolGetter
})

const gestiuneaCurenta = computed(() => {
  return gestiune.value.denumire
})

const gestiuni = computed(() => {
  const gestiuniList = userStore.gestiuniGetter || []
  if (gestiuniList.length > 0 && group.value === 'op1') {
    group.value = gestiuniList[0].id
    gestiune.value = { id: gestiuniList[0].id, denumire: gestiuniList[0].denumire }
    userStore.schimbaGestiuneaCurenta({ id: gestiuniList[0].id, denumire: gestiuniList[0].denumire })
  }
  return gestiuniList.map(item => ({
    label: item.denumire,
    value: item.id
  }))
})

// Methods
const doLogin = () => {
  router.push('/login')
}

const doLogout = () => {
  userStore.schimbaGestiuneaCurenta({ id: 0, denumire: '' })
  userStore.logout()
}

const inchideUser = () => {
  eventsStore.emit('schimbgestiunea', group.value)
}

const actUser = () => {
  console.log('actionez user', group.value, gestiuni.value)
  const selectedGestiune = gestiuni.value.find(item => item.value === group.value)
  if (selectedGestiune) {
    gestiune.value = { id: selectedGestiune.value, denumire: selectedGestiune.label }
    userStore.schimbaGestiuneaCurenta(gestiune.value)
  }
}

// Lifecycle
onMounted(() => {
  console.log('BIFA app a fost creata la ' + process.env.host)
})

// Watch for group changes
watch(group, () => {
  actUser()
})
</script>

<style>
</style>