<template>
  <q-page padding class="row items-start">
    <q-card 
      v-for="g in gestiuni" 
      inline 
      style="width: 200px" 
      class="bg-secondary text-white q-ma-sm" 
      :key="g.denumire"
    >
      <q-card-section>
        <div class="text-h6">{{ g.denumire }}</div>
        <div class="text-subtitle2">Utilizator implicit: {{ g.username }}</div>
      </q-card-section>

      <q-card-section>
        Gestionar: {{ g.gestionar }}
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat @click="vreauDetalii(g.denumire)">Detalii</q-btn>
        <q-btn flat @click="stergGestiune(g.denumire)">Sterge</q-btn>
      </q-card-actions>
    </q-card>
    
    <q-btn
      round
      color="primary"
      @click="showDialog"
      class="fixed"
      icon="add"
      style="right: 48px; bottom: 64px"
    />
    
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">Sunteti sigur ca doriti stergerea?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Abandon" color="primary" v-close-popup />
          <q-btn flat label="Sterge" color="primary" @click="sterg" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog 
      v-model="opened"  
      transition-show="jump-down" 
      transition-hide="jump-up"
    >
      <q-card class="q-pa-md" style="width: 400px; max-width: 90vw;">
        <q-input 
          v-model="numegestiune" 
          label="Denumire" 
          :rules="denumireRules" 
        >
          <q-tooltip>Cimp obligatoriu!</q-tooltip>
        </q-input>

        <q-select 
          v-model="cUser" 
          :options="listaUtilizatori" 
          @update:model-value="userSelectat" 
          label="Utilizator implicit" 
        />
        
        <q-input v-model="gestionar" label="Gestionar" />
        
        <div class="q-pa-sm">
          <q-tabs
            v-model="selectedTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="receptie" icon="mail" label="Comisia receptie" />
            <q-tab name="inventar" icon="mail" label="Comisia inventariere" />
          </q-tabs>

          <q-separator />
 
          <q-tab-panels v-model="selectedTab" animated>
            <q-tab-panel name="receptie">
              <q-input v-model="r_p" label="Presedinte" />
              <q-input v-model="r_m1" label="Membru 1" />
              <q-input v-model="r_m2" label="Membru 2" />
              <q-input v-model="r_m3" label="Membru 3" />
            </q-tab-panel>
            <q-tab-panel name="inventar">
              <q-input v-model="i_p" label="Presedinte" />
              <q-input v-model="i_m1" label="Membru 1" />
              <q-input v-model="i_m2" label="Membru 2" />
              <q-input v-model="i_m3" label="Membru 3" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
        
        <div class="row justify-center">
          <q-btn
            color="primary"
            icon="contact_mail"
            dense
            @click="gestiuneNoua"
            :label="numeButonDialog"
          />

          <q-btn
            color="primary"
            class="q-ml-md"
            icon="code"
            dense
            @click="reset"
            label="Reset"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'

const $q = useQuasar()
const store = useStore()

const confirm = ref(false)
const idGestiuneCurenta = ref(0)
const modificare = ref(false)
const selectedTab = ref('receptie')
const cUser = ref('')
const numegestiune = ref('')
const gestionar = ref('')
const terms = ref('')
const r_p = ref('')
const r_m1 = ref('')
const r_m2 = ref('')
const r_m3 = ref('')
const i_p = ref('')
const i_m1 = ref('')
const i_m2 = ref('')
const i_m3 = ref('')
const userId = ref(0)
const gestiuni = ref([])
const listaUtilizatori = ref([])
const opened = ref(false)

const denumireRules = [
  val => !!val || 'Cimp obligatoriu!'
]

const numeButonDialog = computed(() => {
  return modificare.value ? 'MODIFICA' : 'ADAUGA'
})

const showDialog = () => {
  reset()
  opened.value = true
}

const sterg = async () => {
  console.log('sterg efectiv id ', idGestiuneCurenta.value)
  const token = store.getters.token
  
  try {
    await axios.delete(`${process.env.host}gest/${idGestiuneCurenta.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    $q.notify({
      color: 'secondary',
      icon: 'delete',
      message: 'Gestiune stearsa!'
    })
    
    const index = gestiuni.value.findIndex(item => item.id === idGestiuneCurenta.value)
    if (index > -1) {
      gestiuni.value.splice(index, 1)
    }
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const stergGestiune = (t) => {
  gestiuni.value.map(item => {
    if (item.denumire == t) {
      idGestiuneCurenta.value = item.id
      confirm.value = true
    }
  })
}

const vreauDetalii = (t) => {
  modificare.value = true
  gestiuni.value.map(item => {
    if (item.denumire == t) {
      idGestiuneCurenta.value = item.id
      numegestiune.value = item.denumire
      gestionar.value = item.gestionar
      r_p.value = item.r_presedinte
      r_m1.value = item.r_membru1
      r_m2.value = item.r_membru2
      r_m3.value = item.r_membru3
      i_p.value = item.i_presedinte
      i_m1.value = item.i_membru1
      i_m2.value = item.i_membru2
      i_m3.value = item.i_membru3
      cUser.value = item.username
      userId.value = item.userid
    }
  })
  opened.value = true
}

const userSelectat = (value) => {
  console.log(value.value)
  userId.value = value.value
}

const gestiuneNoua = async () => {
  const token = store.getters.token
  
  if (modificare.value) {
    console.log('e de fapt modificare', idGestiuneCurenta.value)
    modificare.value = false
    
    try {
      await axios.patch(`${process.env.host}gest/${idGestiuneCurenta.value}`, {
        denumire: numegestiune.value,
        userid: userId.value,
        gestionar: gestionar.value,
        r_presedinte: r_p.value,
        r_membru1: r_m1.value,
        r_membru2: r_m2.value,
        r_membru3: r_m3.value,
        i_presedinte: i_p.value,
        i_membru1: i_m1.value,
        i_membru2: i_m2.value,
        i_membru3: i_m3.value,
        stare: "activ"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      opened.value = false

      gestiuni.value.map(item => {
        if (item.id == idGestiuneCurenta.value) {
          item.denumire = numegestiune.value
          item.gestionar = gestionar.value
          item.userid = userId.value
          item.username = cUser.value.label
          item.r_presedinte = r_p.value
          item.r_memebri1 = r_m1.value
          item.r_membru2 = r_m2.value
          item.r_membru3 = r_m3.value
          item.i_presedinte = i_p.value
          item.i_memebru1 = i_m1.value
          item.i_memebru2 = i_m2.value
          item.i_memebru3 = i_m3.value
        }
      })

      $q.notify({
        message: `Gestiunea ${numegestiune.value} a fost actualizata cu succes!`,
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
    } catch (err) {
      console.error('Update error:', err)
    }
  } else {
    try {
      const res = await axios.post(`${process.env.host}gest/gestiunenoua`, {
        denumire: numegestiune.value,
        userid: userId.value,
        gestionar: gestionar.value,
        r_presedinte: r_p.value,
        r_membru1: r_m1.value,
        r_membru2: r_m2.value,
        r_membru3: r_m3.value,
        i_presedinte: i_p.value,
        i_membru1: i_m1.value,
        i_membru2: i_m2.value,
        i_membru3: i_m3.value,
        stare: "activ"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      $q.notify({
        message: `Gestiunea ${numegestiune.value} a fost adaugata cu succes!`,
        timeout: 1500,
        position: 'top',
        color: 'positive'
      })
      
      gestiuni.value.unshift({
        id: res.data.id,
        denumire: numegestiune.value,
        userid: userId.value,
        username: cUser.value.label,
        gestionar: gestionar.value,
        r_presedinte: r_p.value,
        r_membru1: r_m1.value,
        r_membru2: r_m2.value,
        r_membru3: r_m3.value,
        i_presedinte: i_p.value,
        i_membru1: i_m1.value,
        i_membru2: i_m2.value,
        i_membru3: i_m3.value,
      })

      reset()
      opened.value = false
    } catch (err) {
      console.error('Add gestiune error:', err.response?.data?.message)
      $q.notify({
        color: 'negative',
        timeout: 1500,
        position: 'top',
        icon: 'delete',
        message: `ATENTIE! ${err.response?.data?.message || 'Eroare la adaugarea gestiunii'}`
      })
    }
  }
}

const selected = (item) => {
  userId.value = item.id
}

const reset = () => {
  console.log('RESET')
  modificare.value = false
  selectedTab.value = 'receptie'
  numegestiune.value = ''
  userId.value = 0
  cUser.value = ''
  gestionar.value = ''
  r_p.value = ''
  r_m1.value = ''
  r_m2.value = ''
  r_m3.value = ''
  i_p.value = ''
  i_m1.value = ''
  i_m2.value = ''
  i_m3.value = ''
  terms.value = ''
}

const loadGestiuni = async () => {
  console.log('Gestiune curenta', store.getters.gestiuneCurenta)
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}gest/toategestiunile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate gestiunile', gestiuni.value)
    gestiuni.value = [...res.data.gestiuni]
  } catch (err) {
    console.error('Load gestiuni error:', err)
  }
}

const loadUtilizatori = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}user/allusers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    listaUtilizatori.value = res.data.utilizatori.map(user => ({
      label: user.username,
      id: user.id,
      value: user.id
    }))
  } catch (err) {
    console.error('Load users error:', err)
  }
}

onMounted(() => {
  loadGestiuni()
  loadUtilizatori()
})
</script>

