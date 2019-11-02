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
    props: ['data'],
    data: function () {
        return {
           nume_material:"",
           pret_predefinit:1,
           um_material:"buc",
           materiale:this.data
        }
    },
    created(){
      console.log('Componentul MaterialAdd a fost creat cu datele',this.materiale)
    },
    methods:{
        adauga(){
            console.log('Acum am aceste materiale',this.nume_material)

          // this.materiale.push({denumire:this.nume_material,um:this.um_material,pretpredefinit:this.pret_predefinit})
            this.data.unshift({id:999,denumire:this.nume_material,um:this.um_material,pretpredefinit:this.pret_predefinit,user:this.$store.getters.numeReal,gestiune:this.$store.getters.gestiuneCurenta.denumire,eNou:true})
            this.nume_material="";
            this.pret_predefinit=1
            this.um_material="buc";

               this.$q.notify({color:'secondary',message:'Material adaugat cu succes',position:'top'})
        },
        urmatorul(el){
         this.$refs[el].focus();
        }
    }
}

</script>