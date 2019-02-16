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
              <q-btn-dropdown
                  class="glossy"
                  color="purple"
                  :label="numeUtilizator"
                >
                  <div class="row no-wrap q-pa-md">
                    <div class="column">
                      <div class="text-h6 q-mb-md">Gestiuni operate</div>
                        <q-option-group
                          v-model="group"
                          :options="options"
                          color="primary"
                        />
                    </div>

                    <q-separator vertical inset class="q-mx-lg" />

                    <div class="column items-center">
                      <q-avatar size="72px">
                        <img src="https://cdn.quasar-framework.org/img/boy-avatar.png">
                      </q-avatar>

                      <div class="text-subtitle1 q-mt-md q-mb-xs">{{numeUtilizator}}</div>

                      <q-btn
                        color="primary"
                        label="Inchide"
                        push
                        size="sm"
                        v-close-menu
                      />
                    </div>
                  </div>
                </q-btn-dropdown>
        <q-btn class="q-ml-md" v-if="userAutentificat" flat dense @click="doLogout">Iesire!</q-btn>
      </q-toolbar>
    </q-header>

   <q-drawer v-model="left" side="left" bordered>
    <Meniu :rol="rolUtilizator" :logat="userAutentificat"/>
      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

      <q-footer elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>@2019 Narcis Petru Brindusescu! </q-toolbar-title>
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
      left: this.$q.platform.is.desktop,
      group: 'op1',
      options: [
        {
          label: 'GEstiunea 1',
          value: 'op1'
        },
        {
          label: 'GEstiunea 2',
          value: 'op2'
        },
        {
          label: 'GEstiunea 3',
          value: 'op3'
        }
      ]
    }
  },
  created(){
    console.log('BIFA app a fost creata la '+process.env.host)
  },
  computed:{
    userAutentificat(){
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
     //return false;
    },
    numeUtilizator(){
      return this.$store.getters.user
    },
    rolUtilizator(){
       return this.$store.getters.rol
     //return 'admin'
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