<template>

          <q-list  padding class="text-primary">
              <q-item-label v-if="isAdmin" header>Administrare</q-item-label>
                    <q-item
                    clickable
                    v-if="isAdmin"
                    v-ripple
                    :active="link === 'inbox'"
                    @click="clickUtilizatori"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="inbox" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Utilizatori</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-if="isAdmin"
                    v-ripple
                    :active="link === 'outbox'"
                    @click="clickGestiuni"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="send" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Gestiuni</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-if="isAdmin"
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
                    v-if="esteLogat"
                    v-ripple
                    :active="link === 'settings'"
                    @click="link = 'settings'"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="settings" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Operatiune noua...</q-item-section>
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
    props: ['rol','logat'],
    data: function () {
        return {
            link:'inbox',
            rol: this.rol,
            logat:this.logat
        }
    },
    methods:{
      clickUtilizatori(e){
          //alert('Click Utilizatori');
          this.link='inbox';
          this.$router.push('/utilizatori');
      },
      clickIntrari(e){
          this.$router.push('/test');
      },
      clickGestiuni(e){
            this.link='outbox';
          this.$router.push('/gestiuni');
      }
    },
    computed:{
        isAdmin(){
            return this.rol==='admin'
        },
        esteLogat(){
             return this.logat
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
