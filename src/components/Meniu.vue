<template>

          <q-list  padding class="text-primary">
              <q-item-label header>Administrare</q-item-label>
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'inbox'"
                    @click="link = 'inbox'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="inbox" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Utilizatori</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'outbox'"
                    @click="link = 'outbox'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="send" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Gestiuni</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'trash'"
                    @click="link = 'trash'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="delete" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Categorii repere</q-item-section>
                    </q-item>
            
                    <q-separator spaced ></q-separator>
            <q-item-label header>Operatiuni</q-item-label>
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'settings'"
                    @click="link = 'settings'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="settings" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Settings</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'help'"
                    @click="link = 'help'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="help" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Help</q-item-section>
                    </q-item>
      </q-list>
</template>

<script>

export default {
    name:'Meniu',
    props: ['rol'],
    data: function () {
        return {
            link:'inbox',
            rol: this.rol
        }
    },
    methods:{
      clickUtilizatori(e){
          //alert('Click Utilizatori');
          this.$router.push('/utilizatori');
      },
      clickIntrari(e){
          this.$router.push('/test');
      },
      clickGestiuni(e){
          this.$router.push('/test');
      }
    },
    computed:{
        isAdmin(){
            return this.rol==='admin'
        }
    }
}
</script>

<style>
.my-menu-link {
  color: white;
  background: #F2C037;
}
  
</style>
