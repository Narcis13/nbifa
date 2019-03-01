<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                    title="Categorii repere"
                    :data="categorii"
                    :columns="columns"
                    row-key="id"
                    :filter="filter"
                    selection="single"
                    :selected.sync="selected"
                    :pagination.sync="pagination"
                    rows-per-page-label="Inregistrari pe pagina"

             >
             <template v-slot:top>
                    <q-btn  outline rounded  color="primary"  label="Adauga" @click="opened=true" ></q-btn>
                    <q-btn class="on-right"  outline rounded  color="primary"  label="Sterge" @click="removeRow" ></q-btn>
                    <q-space ></q-space>
                    <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Cauta">
                        <template v-slot:append>
                        <q-icon name="search" ></q-icon>
                        </template>
                    </q-input>
           </template>
            </q-table>

               <q-dialog v-model="opened"  transition-show="jump-down" transition-hide="jump-up">
                  <q-card class="q-pa-md" style="width: 400px; max-width: 90vw;padding:10">
                       <q-input v-model="denumire" label="Denumire" :rules="[val => !!val || 'Cimp obligatoriu!']" >
                         <q-tooltip>Cimp obligatoriu!</q-tooltip>
                        </q-input>

                        <q-select v-model="numegestiune" :options="gestiuni" @input="gestSelectata" label="Gestiune" />
                        <q-input v-model="cont" label="Cont (debit)"  />
                        <q-input v-model="contcheltuiala" label="Cont cheltuiala"  />

                        <div class="q-mt-md q-gutter-sm">
                            <q-radio v-model="tipmaterial" val="MAT." label="Material" />
                            <q-radio v-model="tipmaterial" val="OB. INV." label="Obiect inventar" />
                            <q-radio v-model="tipmaterial" val="M. FIX" label="Mijloc fix" />

                       </div>
                        <div class="row justify-center q-mt-md">
                          <q-btn
                            color="primary"
                            icon="contact_mail"
                            dense
                            @click="categNoua"
                            label="Adauga"
                          />

                          <q-btn
                            color="primary"
                            class="q-ml-md"
                            icon="code"
                            dense
                            @click="reset"
                            label="Reset"
                          />

                      </div>
                  </q-card>
               </q-dialog>

        </div>
    </q-page>
</template>



<script>
import axios from 'axios'
export default {
    data(){
        return {
            categorii:[],
            gestiuni:[],
            opened:false,
            denumire:'',
            numegestiune:'',
            idgestiune:0,
            cont:'',
            contcheltuiala:'',
            tipmaterial:'MAT.',
            pagination: {
                sortBy: 'name',
                descending: false,
                page: 1,
                rowsPerPage: 12
                // rowsNumber: xx if getting data from a server
             },
            columns: [
                    {
                    name: 'id',
                    required: true,
                    label: 'ID',
                    align: 'left',
                    field: 'id',
                    sortable: true
                    },
                    { name: 'denumire', label: 'Denumire', field: 'denumire', sortable: true,align: 'left' },
                    { name: 'gestiune', label: 'Gestiune', field: 'gestiune', sortable: true ,align: 'left'},
                    { name: 'cont', label: 'Cont', field: 'cont',align: 'left' },
                    { name: 'contcheltuiala', label: 'Cont cheltuiala', field: 'contcheltuiala' ,align: 'left'},
                    { name: 'tipmaterial', label: 'Tip material', field: 'tipmaterial',align: 'left' }

                
                ],
                    filter: '',
                    selected: []
        }
    },
      created(){
     //console.log('Se creeaza Utilizatorii....')
     const token=this.$store.getters.token;

      axios.get(process.env.host+'categ/toate',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate categoriile',res.data.categorii);
           this.categorii=[...res.data.categorii]
        }
      ).catch(err =>{})

      axios.get(process.env.host+'gest/toategestiunile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
          this.gestiuni=res.data.gestiuni.map(gest => {
                                                            return {
                                                              label: gest.denumire,
                                                              id:gest.id,
                                                              value: gest.id
                                                            }
                                                          })
        }
      ).catch(err =>{})
  },
  computed: {
    tableClass () {
      if (this.dark) {
        return 'bg-black'
      }
    },
    passHasError(){
        return this.pass.length>0&&this.pass.length<5
      }
  },
  methods:{
        reset(){
            this.denumire='';
            this.numegestiune='';
            this.idgestiune=0;
            this.cont='';
            this.contcheltuiala='';
            this.tipmaterial='MAT.';
        },
        gestSelectata(v){
          console.log(v);
         this.idgestiune=v.value
        },
        categNoua(){
          const token=this.$store.getters.token;
          var that = this;

                axios.post(process.env.host+'categ/categorienoua',{
                "denumire":this.denumire,
                "idgestiune":this.idgestiune,
                "cont":this.cont,
                "contcheltuiala":this.contcheltuiala,
                "tipmaterial":this.tipmaterial,

                "stare":"activ"
              },{headers:{"Authorization" : `Bearer ${token}`}}).then(
                    res => {
                      console.log('raspuns insert categorie',res);
                        this.$q.notify({
                        message:`Categoria de repere ${that.denumire} a fost adaugata cu succes!`,
                        timeout:1500,
                        position:'top',
                        color:'positive'
              });

                that.categorii.unshift({
                  "id":res.data.id,
                  "denumire":that.denumire,
                  "idgestiune":that.idgestiune,
                  "cont":that.cont,
                  "contcheltuiala":that.contcheltuiala,
                  "tipmaterial":that.tipmaterial,
                  "gestiune":that.numegestiune,

                });

              that.reset();

              that.opened=false;
                    }
            ).catch(err=>{
              console.log('Eroare.............',err.response.data.message)
              this.$q.notify({
                            color: 'negative',
                            timeout:1500,
                            position:'top',
                            icon: 'delete',
                            message: `ATENTIE! ${err.response.data.message}`
                          })
            });
        }
  }
}
</script>
