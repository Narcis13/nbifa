<template>
     <q-btn icon="add_box" color="secondary" flat label="Adauga" class="q-mr-sm">
           <q-menu>
                    
                    <div class="column no-wrap q-pa-md" style="min-width:300px">
                        <q-input autofocus ref="edNume" v-model="nume_material" label="Denumire"  @keyup.enter="urmatorul('edUM')" />
                        <q-input ref="edUM" v-model="um_material" label="UM" @keyup.enter="urmatorul('edPret')"  />
                        <q-input ref="edPret" v-model.number="pret_predefinit" label="Pret predefinit" type="number"   />
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

<script>

export default {
    name:'MaterialAdd',
    props: [],
    data: function () {
        return {
           nume_material:"",
           pret_predefinit:1,
           um_material:"buc"
        }
    },
    methods:{
        adauga(){
               this.$q.notify('Material adaugat cu succes')
        },
        urmatorul(el){
         this.$refs[el].focus();
        }
    }
}

</script>