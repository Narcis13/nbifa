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
          BIFA Gestiune
          
        </q-toolbar-title>
        <q-btn v-if="!userAutentificat" flat dense @click="doLogin">Autentificare!</q-btn>
              
        <q-btn v-if="userAutentificat" flat dense @click="doLogout">Iesire!</q-btn>
      </q-toolbar>
    </q-header>

   <q-drawer v-model="left" side="left" bordered>
    <Meniu :rol="rolUtilizator"/>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>@2018 Narcis Petru Brindusescu </q-toolbar-title>
        </q-toolbar>     
      </q-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import Meniu from '../components/Meniu'

export default {
  name: 'MyLayout',
  components:{
    'Meniu':Meniu
  },
  data () {
    return {
      left: this.$q.platform.is.desktop
    }
  },
  created(){
    console.log('BIFA app a fost creata la '+process.env.host)
  },
  computed:{
    userAutentificat(){
     // return this.$store.getters.user !== null && this.$store.getters.user !== undefined
     return true;
    },
    numeUtilizator(){
      return this.$store.getters.user
    },
    rolUtilizator(){
     //  return this.$store.getters.rol
     return 'admin'
    }
  },
  methods: {
    openURL,
    doLogin(){
     this.$router.push('/login');
    },
    doLogout(){
      this.$store.dispatch('logout');
    }

  }
}
</script>

<style>
</style>