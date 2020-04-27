<template>

          <q-list  padding class="text-primary" style="width:230px">
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
                        <q-icon name="contacts" ></q-icon>
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
                        <q-icon name="list_alt" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Gestiuni</q-item-section>
                    </q-item>

                    <q-item
                        clickable
                        v-if="isAdmin"
                        v-ripple
                        :active="link === 'conturi'"
                        @click="clickConturi"
                        active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="sort" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Plan Conturi</q-item-section>
                    </q-item>
                    
            
                    <q-item
                    clickable
                    v-if="isAdmin"
                    v-ripple
                    :active="link === 'trash'"
                    @click="clickCategorii"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="ballot" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Categorii repere</q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-if="isAdmin"
                        v-ripple
                        :active="link === 'setari'"
                        @click="clickSetari"
                        active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="settings_applications" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Configurare aplicatie</q-item-section>
                    </q-item>
                    <q-separator v-if="esteLogat" spaced ></q-separator>
                   <q-item-label v-if="esteLogat" header>Nomenclatoare</q-item-label>
                    <q-item
                    clickable
                    v-if="esteLogat"
                    v-ripple
                    :active="link === 'locuri'"
                    @click="clickLocuri"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="library_books" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Locuri de dispunere</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-ripple
                     v-if="esteLogat"
                    :active="link === 'materiale'"
                    @click="clickMateriale"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="dns" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Materiale</q-item-section>
                    </q-item>




                    <q-separator spaced ></q-separator>
            <q-item-label header>Operatiuni</q-item-label>
                    <q-item
                    clickable
                    v-if="esteLogat"
                    v-ripple
                    :active="link === 'operatiunenoua'"
                    @click="clickDocNou"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="note_add" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Operatiune noua...</q-item-section>
                    </q-item>
            
                    <q-item
                    clickable
                    v-ripple
                    :active="link === 'rapoarte'"
                    @click="clickRapoarte"
                    active-class="my-menu-link"
                    >
                    <q-item-section avatar>
                        <q-icon name="assignment" ></q-icon>
                    </q-item-section>
            
                    <q-item-section>Rapoarte</q-item-section>
                    </q-item>
      </q-list>
</template>

<script>

export default {
    name:'Meniu',
    props: ['rol','logat'],
    data: function () {
        return {
            link:'inbox'//,
           // rol: this.rol,
         //   logat:this.logat
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
      clickLocuri(e){
            this.link='locuri';
            this.$router.push('/locuri');
      },
      clickDocNou(e){
           this.link='operatiunenoua';
            this.$router.push('/documente');
      },
      clickMateriale(e){
            this.link='materiale';
            this.$router.push('/materiale');
      },
      clickGestiuni(e){
            this.link='outbox';
          this.$router.push('/gestiuni');
      },
      clickConturi(e){
            this.link='conturi';
            this.$router.push('/conturi');
      },
      clickSetari(e){
            this.link='setari';
           // this.$router.push('/conturi');
           alert('Setari aplicatie neimenentat!')
      },
      clickCategorii(e){
            this.link='trash';
          this.$router.push('/categorii');
      },
      clickRapoarte(e){
            this.link='rapoarte';
          this.$router.push('/rap');
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
