<template>
  <q-page padding>
    <q-btn 
      icon="add_circle" 
      @click="opened = true" 
      color="secondary" 
      flat 
      label="Adauga" 
      class="q-mr-sm" 
    />
    <q-table
      :data="tableData"
      :columns="columns"
      selection="single"
      v-model:selected="selectedSecond"
      row-key="id"
      color="secondary"
      title="Utilizatori"
    >
      <template #top-selection="props">
        <div class="col" />
        <q-btn 
          color="negative" 
          flat 
          round 
          icon="delete" 
          @click="deleteRow" 
        />
      </template>
    </q-table>
    
    <q-dialog 
      v-model="opened"  
      transition-show="jump-down" 
      transition-hide="jump-up"
    >
      <q-card class="q-pa-md" style="width: 400px; max-width: 90vw;">
        <q-input 
          v-model="username" 
          label="Utilizator" 
          @keyup.enter="urmatorul('edParola')"
        />

        <q-input 
          ref="edParola" 
          type="password" 
          label="Parola" 
          v-model="pass"  
          :rules="passwordRules" 
          @keyup.enter="urmatorul('edRol')" 
        /> 

        <q-input 
          ref="edRol" 
          v-model="rol" 
          label="Rol"  
          @keyup.enter="urmatorul('edNume')" 
        />

        <q-input 
          ref="edNume" 
          v-model="nume" 
          label="Nume prenume" 
          @keyup.enter="urmatorul('edEmail')"  
        />

        <q-input 
          ref="edEmail" 
          v-model="email" 
          label="E-mail" 
          type="email"  
        />

        <div class="row justify-center q-pa-md">
          <q-btn
            color="primary"
            icon="contact_mail"
            @click="adaugUser"
            label="Salvez"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import axios from 'axios'

const $q = useQuasar()
const store = useStore()

const tableData = ref([])
const opened = ref(false)
const username = ref('')
const pass = ref('')
const email = ref('')
const rol = ref('')
const nume = ref('')
const selectedSecond = ref([])

const edParola = ref(null)
const edRol = ref(null)
const edNume = ref(null)
const edEmail = ref(null)

const paginationControl = reactive({ 
  rowsPerPage: 3, 
  page: 1 
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
    name: 'username', 
    label: 'Nume utilizator', 
    field: 'username', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'name', 
    label: 'Nume si prenume', 
    field: 'name', 
    sortable: true 
  },
  { 
    name: 'email', 
    label: 'Email', 
    field: 'email' 
  },
  { 
    name: 'created_at', 
    label: 'Creat la...', 
    field: 'created_at' 
  },
  { 
    name: 'updated_at', 
    label: 'Modificat la...', 
    field: 'updated_at' 
  },
  { 
    name: 'rol', 
    label: 'Rol', 
    field: 'rol', 
    sortable: true 
  }
]

const passwordRules = [
  value => value.length > 4 || 'Parola trebuie sa aiba minim 5 caractere'
]


watch(() => paginationControl.page, (page) => {
  $q.notify({
    color: 'secondary',
    message: `Navigated to page ${page}`,
    actions: page < 4
      ? [{
        label: 'Go to last page',
        handler: () => {
          paginationControl.page = 4
        }
      }]
      : null
  })
})

const urmatorul = (el) => {
  if (el === 'edParola') edParola.value?.focus()
  else if (el === 'edRol') edRol.value?.focus()
  else if (el === 'edNume') edNume.value?.focus()
  else if (el === 'edEmail') edEmail.value?.focus()
}

const deleteRow = async () => {
  if (!selectedSecond.value || selectedSecond.value.length === 0) return
  
  const token = store.getters.token
  const id = selectedSecond.value[0].id
  
  try {
    await axios.delete(`${process.env.host}user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    $q.notify({
      color: 'secondary',
      icon: 'delete',
      message: 'Utilizator sters!'
    })
    
    const index = tableData.value.findIndex(item => item.id === id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
  } catch (err) {
    console.error('Delete error:', err)
  }
}

const adaugUser = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.post(`${process.env.host}user/signup`, {
      username: username.value,
      password: pass.value,
      name: nume.value,
      email: email.value,
      stare: 'activ',
      rol: rol.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    $q.notify({
      message: `Utilizatorul ${username.value} a fost adaugat cu succes!`,
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })
    
    tableData.value.unshift({
      id: res.data.id,
      username: username.value,
      password: pass.value,
      name: nume.value,
      email: email.value,
      rol: rol.value
    })
    
    username.value = ''
    nume.value = ''
    pass.value = ''
    rol.value = ''
    email.value = ''
    opened.value = false
    
  } catch (err) {
    console.error('Add user error:', err.response?.data?.message)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `ATENTIE! ${err.response?.data?.message || 'Eroare la adaugarea utilizatorului'}`
    })
  }
}

const loadUsers = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}user/allusers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    tableData.value = [...res.data.utilizatori]
  } catch (err) {
    console.error('Load users error:', err)
  }
}

onMounted(() => {
  loadUsers()
})
</script>