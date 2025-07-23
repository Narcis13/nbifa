<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Categorii repere"
        :data="categorii"
        :columns="columns"
        row-key="id"
        :filter="filter"
        selection="single"
        v-model:selected="selected"
        v-model:pagination="pagination"
        rows-per-page-label="Inregistrari pe pagina"
      >
        <template #top>
          <q-btn  
            outline 
            rounded  
            color="primary"  
            icon="add_box" 
            label="Adauga" 
            @click="opened = true" 
          />
          <q-btn 
            class="on-right" 
            icon="delete_sweep"  
            outline 
            rounded  
            color="primary"  
            label="Sterge" 
            @click="stergCateg" 
          />
          <q-space />
          <q-input 
            borderless 
            dense 
            debounce="300" 
            color="primary" 
            v-model="filter" 
            placeholder="Cauta"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="denumire" :props="props">
              {{ props.row.denumire }}
              <q-popup-edit 
                v-model="props.row.denumire" 
                @save="editeaza(props.row.id,'denumire',props.row.denumire)"
              >
                <q-input v-model="props.row.denumire" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="gestiune" :props="props">
              {{ props.row.gestiune }}
              <q-popup-edit 
                buttons 
                v-model="props.row.gestiune" 
                @save="editeaza(props.row.id,'idgestiune',idgestiune)"
              >
                <q-select 
                  v-model="props.row.gestiune" 
                  :options="gestiuni" 
                  @update:model-value="gestSelectata" 
                  label="Gestiune" 
                />
              </q-popup-edit>
            </q-td>
            <q-td key="cont" :props="props">
              {{ props.row.cont }}
            </q-td>
            <q-td key="contcheltuiala" :props="props">
              {{ props.row.contcheltuiala }}
            </q-td>
            <q-td key="tipmaterial" :props="props">
              {{ props.row.tipmaterial }}
              <q-popup-edit 
                v-model="props.row.tipmaterial" 
                @save="editeaza(props.row.id,'tipmaterial',props.row.tipmaterial)"
              >
                <q-radio v-model="props.row.tipmaterial" val="M" label="Material" />
                <q-radio v-model="props.row.tipmaterial" val="OB" label="Obiect inventar" />
                <q-radio v-model="props.row.tipmaterial" val="MF" label="Mijloc fix" />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-dialog 
        v-model="opened"  
        transition-show="jump-down" 
        transition-hide="jump-up"
      >
        <q-card class="q-pa-md" style="width: 400px; max-width: 90vw;">
          <q-input 
            v-model="denumire" 
            label="Denumire" 
            :rules="denumireRules" 
          >
            <q-tooltip>Cimp obligatoriu!</q-tooltip>
          </q-input>

          <q-select 
            v-model="numegestiune" 
            :options="gestiuni" 
            @update:model-value="gestSelectata" 
            label="Gestiune" 
          />
          
          <q-select
            v-model="cont"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="conturianalitice"
            @filter="filterFn"
            label="Cont analitic"
            hint="Tastati 2 caractere pentru a afisa lista cu optiuni"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nicio optiune!
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          
          <q-select
            v-model="contcheltuiala"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="conturicheltuiala"
            @filter="filterFn"
            label="Cont cheltuiala"
            hint="Tastati 2 caractere pentru a afisa lista cu optiuni"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nicio optiune!
                </q-item-section>
              </q-item>
            </template>
          </q-select>                    

          <div class="q-mt-md q-gutter-sm">
            <q-radio v-model="tipmaterial" val="M" label="Material" />
            <q-radio v-model="tipmaterial" val="OB" label="Obiect inventar" />
            <q-radio v-model="tipmaterial" val="MF" label="Mijloc fix" />
          </div>
          
          <div class="row justify-center q-mt-md">
            <q-btn
              color="primary"
              icon="contact_mail"
              dense
              @click="categNoua"
              label="Adauga"
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
    </div>
  </q-page>
</template>



<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'

const $q = useQuasar()
const store = useStore()

const categorii = ref([])
const gestiuni = ref([])
const conturianalitice = ref([])
const conturicheltuiala = ref([])
const opened = ref(false)
const denumire = ref('')
const numegestiune = ref('')
const idgestiune = ref(0)
const cont = ref('')
const contcheltuiala = ref('')
const tipmaterial = ref('M')
const filter = ref('')
const selected = ref([])

let optiunianalitice = []

const pagination = reactive({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 12
})

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true
  },
  { 
    name: 'denumire', 
    label: 'Denumire', 
    field: 'denumire', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'gestiune', 
    label: 'Gestiune', 
    field: 'gestiune', 
    sortable: true, 
    align: 'left'
  },
  { 
    name: 'cont', 
    label: 'Cont', 
    field: 'cont', 
    align: 'left' 
  },
  { 
    name: 'contcheltuiala', 
    label: 'Cont cheltuiala', 
    field: 'contcheltuiala', 
    align: 'left'
  },
  { 
    name: 'tipmaterial', 
    label: 'Tip material', 
    field: 'tipmaterial', 
    align: 'left' 
  }
]

const denumireRules = [
  val => !!val || 'Cimp obligatoriu!'
]

function removeByKey(array, params) {
  array.some(function(item, index) {
    return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false
  })
  return array
}

const editeaza = async (id, cheie, valoarenoua) => {
  console.log('editez', id, cheie, valoarenoua)
  const token = store.getters.token
  
  try {
    await axios.put(`${process.env.host}categ/${id}`, { [cheie]: valoarenoua }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err) {
    console.error('Edit error:', err)
  }
}

const reset = () => {
  console.log('reset', cont.value)
  denumire.value = ''
  numegestiune.value = ''
  idgestiune.value = 0
  cont.value = ''
  contcheltuiala.value = ''
  tipmaterial.value = 'M'
}

const gestSelectata = (v) => {
  console.log(v)
  idgestiune.value = v.value
}

const stergCateg = async () => {
  if (selected.value.length == 0) {
    $q.notify({
      message: 'Selectati o categorie!',
      timeout: 1500,
      position: 'top',
      color: 'positive' 
    })
    return
  }
  
  console.log('sterg', selected.value[0].id)
  const token = store.getters.token
  
  try {
    await axios.patch(`${process.env.host}categ/${selected.value[0].id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    categorii.value = removeByKey(categorii.value, { key: 'id', value: selected.value[0].id })
    
    $q.notify({
      message: 'Categoria selectata a fost invalidata!',
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const filterFn = (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    console.log('filtru', optiunianalitice, conturianalitice.value)
    const needle = val.toLowerCase()
    conturianalitice.value = optiunianalitice.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    conturicheltuiala.value = optiunianalitice.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const categNoua = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.post(`${process.env.host}categ/categorienoua`, {
      denumire: denumire.value,
      idgestiune: idgestiune.value,
      idcont: cont.value.value,
      cont: cont.value.label,
      idcontchelt: contcheltuiala.value.value,
      contcheltuiala: contcheltuiala.value.label,
      tipmaterial: tipmaterial.value,
      stare: "activ"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('raspuns insert categorie', res, numegestiune.value)
    $q.notify({
      message: `Categoria de repere ${denumire.value} a fost adaugata cu succes!`,
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })

    categorii.value.unshift({
      id: res.data.id,
      denumire: denumire.value,
      idgestiune: idgestiune.value,
      cont: cont.value,
      contcheltuiala: contcheltuiala.value,
      tipmaterial: tipmaterial.value,
      gestiune: numegestiune.value.label,
    })

    reset()
    opened.value = false
    
  } catch (err) {
    console.error('Add category error:', err.response?.data?.message)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! ${err.response?.data?.message || 'Eroare la adaugarea categoriei'}`
    })
  }
}

const loadCategorii = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}categ/toate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate categoriile', res.data.categorii)
    categorii.value = [...res.data.categorii]
  } catch (err) {
    console.error('Load categories error:', err)
  }
}

const loadConturi = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}conturi/toatetoate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate conturile si analitice', res.data)
    const mappedConturi = res.data.conturi.map((c) => ({
      label: c.cont + " " + c.denumire,
      value: c.id
    }))
    
    conturianalitice.value = mappedConturi
    optiunianalitice = [...mappedConturi]
    conturicheltuiala.value = [...mappedConturi]
  } catch (err) {
    console.error('Load conturi error:', err)
  }
}

const loadGestiuni = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}gest/toategestiunile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    gestiuni.value = res.data.gestiuni.map(gest => ({
      label: gest.denumire,
      id: gest.id,
      value: gest.id
    }))
  } catch (err) {
    console.error('Load gestiuni error:', err)
  }
}

onMounted(() => {
  loadCategorii()
  loadConturi()
  loadGestiuni()
})
</script>
