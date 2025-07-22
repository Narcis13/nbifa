<template>
  <q-page class="flex flex-center">
     <div  class="bg-grey-2" style=" padding: 25px">
         
      
         <q-input autofocus label="Utilizator" v-model="numeUser" :rules="[val => !!val || 'Cimp obligatoriu!']" />
        
   
        <q-input label="Parola" type="password" v-model="pass"  /> 
        
        
    <br/>
    <div class="row justify-center">
        <q-btn flat @click="autentificare">Autentificare</q-btn>
    </div>
         
    </div>
 </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const $q = useQuasar()
const route = useRoute()
const userStore = useUserStore()

// Reactive data
const numeUser = ref('')
const pass = ref('')

// Methods
const autentificare = () => {
  const sufix = route.path === "/aky" ? "loginaky" : "login"
  
  axios.post(process.env.API_URL + 'user/' + sufix, {
    user: numeUser.value,
    parola: pass.value
  }).then(res => {
    console.log('Raspuns la autentificare ', res)
    $q.notify({
      message: res.data.message,
      timeout: 1500,
      position: 'top',
      color: 'positive'
    })

    if (sufix === "loginaky") {
      userStore.akysignUserIn(res.data)
    } else {
      userStore.signUserIn(res.data)
    }
  }).catch(err => {
    numeUser.value = ''
    pass.value = ''
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: `User sau parola incorecte...`
    })
    console.log('Eroare autentificare', err)
  })
}

// Lifecycle
onMounted(() => {
  console.log('Login form mounted!', route.path)
})
</script>
