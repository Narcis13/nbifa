<template>
<nav>
  <v-toolbar app>
     <v-toolbar-side-icon class="indigo--text" @click="draw=!draw"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>BIFA</span>
        <span class="font-weight-light">Gestiune</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  class="purple white--text ">
        <v-icon left>
          lock
        </v-icon>
        <span>Autentificare</span>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="draw" app dark class="indigo lighten-1">
        <v-list>
          <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-tile-action>
              <v-icon class="white--text">{{link.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                   {{link.text}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</nav>    
</template>

<script>
  export default {
    data: () => ({
       draw:false,
       links:[
         {icon:'build',text:'Administrare',route:'/admin'},
         {icon:'dashboard',text:'Dashboard',route:'/'},
         {icon:'ballot',text:'Nomenclatoare',route:'/liste'},
         {icon:'receipt',text:'Operatiuni',route:'/operatiuni'},
         {icon:'file_copy',text:'Rapoarte',route:'/rapoarte'}
       ]
   })
  }

</script>

<style>

</style>
