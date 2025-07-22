<template>
  <q-btn icon="add_box" color="secondary" flat label="Adauga" class="q-mr-sm" @click="adMaterial">
    <q-menu>
      <div class="column no-wrap q-pa-md" style="min-width:300px">
        <q-input 
          autofocus 
          ref="edNume" 
          v-model="nume_material" 
          label="Denumire" 
          @keyup.enter="urmatorul('edUM')" 
        />
        <q-input 
          ref="edUM" 
          v-model="um_material" 
          label="UM" 
          @keyup.enter="urmatorul('edPret')" 
        />
        <q-input 
          ref="edPret" 
          v-model.number="pret_predefinit" 
          label="Pret predefinit" 
          type="number" 
        />
        <q-input v-model="cod_material" label="Cod">
          <template v-slot:append>
            <q-btn round color="green" icon="search" dense @click="aflaUltimulCod" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          @click="adauga"
          label="Salveaza!"
          push
          size="sm"
          v-close-popup
        />
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { useEventsStore } from '../stores/events'

// Stores and composables
const $q = useQuasar()
const userStore = useUserStore()
const eventsStore = useEventsStore()

// Props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  mat: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['materialnou'])

// Template refs
const edNume = ref(null)
const edUM = ref(null)
const edPret = ref(null)

// Reactive data
const nume_material = ref("")
const pret_predefinit = ref(1)
const um_material = ref("buc")
const cod_material = ref(" ")

// Methods
const adMaterial = () => {
  console.log('ADAUG MATERIAL!', props.mat)
}

const adauga = async () => {
  const token = userStore.tokenGetter
  const gestiuneCurenta = userStore.gestiuneCurentaGetter
  const userid = userStore.userid
  const numeReal = userStore.numeReal

  try {
    const res = await axios.post(
      process.env.API_URL + 'materiale/materialnou',
      {
        "denumire": nume_material.value,
        "um": um_material.value,
        "cod_import": cod_material.value,
        "pretpredefinit": pret_predefinit.value,
        "idgestiune": gestiuneCurenta.id,
        "iduser": userid,
        "stare": "activ"
      },
      { headers: { "Authorization": `Bearer ${token}` } }
    )

    console.log('raspuns insert material', res)
    
    $q.notify({
      message: `Reperul ${nume_material.value} a fost adaugat cu succes!`,
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })

    const mat_nou = {
      id: res.data.id,
      denumire: nume_material.value,
      cod_import: cod_material.value,
      um: um_material.value,
      pretpredefinit: pret_predefinit.value,
      user: numeReal,
      gestiune: gestiuneCurenta.denumire,
      datacreere: new Date().toISOString(),
      datamodificare: new Date().toISOString(),
      eNou: true
    }

    emit('materialnou', mat_nou)
    eventsStore.emit('materialadaugat', mat_nou)
    
    props.data.unshift(mat_nou)
    
    // Reset form
    nume_material.value = ""
    pret_predefinit.value = 1
    um_material.value = "buc"
    cod_material.value = " "
  } catch (err) {
    console.log('Eroare.............', err.response?.data?.message)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! ${err.response?.data?.message || 'Eroare necunoscuta'}`
    })
  }
}

const aflaUltimulCod = async () => {
  const token = userStore.tokenGetter
  const gestiuneCurenta = userStore.gestiuneCurentaGetter

  try {
    const res = await axios.get(
      process.env.API_URL + `materiale/ultimulcod/${gestiuneCurenta.id}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    )
    
    console.log('Raspuns la ultimul cod', res.data)
    cod_material.value = res.data.coduri[0][0].cod_import
  } catch (err) {
    console.error('Error getting last code:', err)
  }
}

const urmatorul = (el) => {
  if (el === 'edUM' && edUM.value) {
    edUM.value.focus()
  } else if (el === 'edPret' && edPret.value) {
    edPret.value.focus()
  }
}

// Lifecycle
onMounted(() => {
  console.log('Componentul MaterialAdd a fost creat cu mat', props.mat)
})
</script>