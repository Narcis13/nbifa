<template>
     <q-card  style="width: 1200px; height:800px;max-width: 80vw;max-height: 80vh;">
                      
                          
                     <div class="column">
                          <div class="row q-mt-md" style="height:90%;">
                            
                            <div class="col-5 q-pa-sm">
                                <q-table
                                
                                      class="my-sticky-virtscroll-table"
                                      :filter="filter"
                                      dense
                                      wrap-cells
                                      virtual-scroll
                                      :pagination.sync="pagination"
                                      :rows-per-page-options="[0]"
                                      :virtual-scroll-sticky-size-start="48"
                                      row-key="id"
                                      separator="cell"
                                      title="PAAP"
                                      :data="paap"
                                      :columns="coloane_paap"
                                      selection="multiple"
                                        binary-state-sort
                                        ref="paaptable"
                                      :selected.sync="selected"
                                >
                                <template v-slot:top>
                                  <div class="text-h6">PAAP</div>
                                  <q-space />
                                      <q-input borderless dense debounce="300" color="primary" v-model="filter">
                                        <template v-slot:append>
                                          <q-icon name="search" />
                                        </template>
                                      </q-input>
                                </template>
                                </q-table>
                            </div>

                            <div id="drrr" class="col-7 q-pa-sm coloana-dreapta">

                              <div class="row ">
                                    <q-input class="q-mt-md" stack-label  label="Data achizitie" dense filled v-model="data_referat" mask="date" :rules="['date']">
                                        <template v-slot:append>
                                          <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                              <q-date v-model="data_referat">
                                                <div class="row items-center justify-end">
                                                  <q-btn v-close-popup label="Inchide" color="primary" flat />
                                                </div>
                                              </q-date>
                                            </q-popup-proxy>
                                          </q-icon>
                                        </template>
                                  </q-input>

                                  <q-input class="q-ml-xl" style="width:300px;" dense stack-label filled v-model="obiect_achizitie" label="Obiect achizitie" />

                              </div>

                              <q-separator inset />

                              <div class="row">
                                    <div style="height:100px" class="drop col-6 shadow-1 q-pa-sm q-mt-md ">
                                          <div><span class="text-bold">Denumire reper: </span> dcasdasd asd asdaaads asd asd asdsa dasd adsas dsad asd asdddasda sd asdaa</div>
                                          <div><span class="text-bold">Cod CPV: </span> 3-123456 </div>
                                    </div>
                                    <div class="col-6 q-pa-sm q-mt-sm" >
                                        <q-input
                                          v-model="detalii_tehnice"
                                          label="Detalii tehnice"
                                          filled
                                          style="height:100px"
                                          type="textarea"
                                        />
                                    </div>
                              </div>

                              <div class="row q-mt-sm justify-between">
                                    <q-input v-model.number="model" type="number" filled dense label="Cantitate" />
                                    <q-input v-model.number="model" type="number" filled dense label="Pret" />
                                    <q-input class="q-mr-sm" v-model.number="model" type="number" filled dense label="Valoare" />
                              </div>

                              <div class="row justify-center q-mt-md q-mb-md">
                                  <q-btn flat label="Adauga!"   />
                              </div>

                              <q-separator inset />

                              <div class="q-pa-xs q-mt-sm">
                                <q-table
                                    :id="uuid"
                                    dense
                                    :data="data"
                                    :columns="columns"
                                    row-key="name"
                                  />
                              </div>

  
                            </div>

                          </div>


                        <div class="row justify-center">
                          <q-btn flat label="Abandon" v-close-popup />
                         
                          <q-btn flat label="Salveaza!"   />
                        </div>
              </div>
                        
     </q-card>
</template>
<script>
import axios from 'axios'

import {
        uid
    } from 'quasar'
export default {
    name:'ReferatNecesitateAdd',
    props:['mod'],
    
    data: function () {
        return {
           data_referat:'2020/03/26',
           uuid:'',
           obiect_achizitie:'',
           detalii_tehnice:'',
           model:0,
           paap:[],
           selected:[],
           filter:'',
           coloane_paap:[
             {
                name: 'id',
                label: '#',
                field: 'id'
              },
              {
                name: 'articol',
                required: true,
                label: 'Obiectul achizitiei',
                align: 'left',
                style: 'max-width: 300px',
                field: 'obiectachizitie_text',
                format: val => `${val}`,
                sortable: true
              },

              { name: 'cantitate', align:'right',label: 'Cantitate', field: 'cantitate', sortable: true }
           ],
          pagination: {
             rowsPerPage: 0
          },
           columns: [
              {
                name: 'name',
                required: true,
                label: 'Dessert (100g serving)',
                align: 'left',
                field: row => row.name,
                format: val => `${val}`,
                sortable: true
              },
              { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
              { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
              { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
              { name: 'protein', label: 'Protein (g)', field: 'protein' },
              { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
              { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
              { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
            ],
            data: [
              {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                sodium: 87,
                calcium: '14%',
                iron: '1%'
              },
              {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
                carbs: 37,
                protein: 4.3,
                sodium: 129,
                calcium: '8%',
                iron: '1%'
              },
              {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
                carbs: 23,
                protein: 6.0,
                sodium: 337,
                calcium: '6%',
                iron: '7%'
              },
              {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
                sodium: 413,
                calcium: '3%',
                iron: '8%'
              },
              {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
                carbs: 49,
                protein: 3.9,
                sodium: 327,
                calcium: '7%',
                iron: '16%'
              },
              {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
                carbs: 94,
                protein: 0.0,
                sodium: 50,
                calcium: '0%',
                iron: '0%'
              },
              {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
                carbs: 98,
                protein: 0,
                sodium: 38,
                calcium: '0%',
                iron: '2%'
              },
              {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
                carbs: 87,
                protein: 6.5,
                sodium: 562,
                calcium: '0%',
                iron: '45%'
              },
              {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
                carbs: 51,
                protein: 4.9,
                sodium: 326,
                calcium: '2%',
                iron: '22%'
              },
              {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
                carbs: 65,
                protein: 7,
                sodium: 54,
                calcium: '12%',
                iron: '6%'
              }
            ]
        }
    },
    created(){
      console.log('Componentul ReferatNecesitateAdd a fost creat !')
          this.uuid = uid();
          const token=this.$store.getters.akytoken;
          const rol = this.$store.getters.akyroluserlogat;
          const id_comp = this.$store.getters.idcompartimentakyuserlogat;
          let an=(new Date()).getFullYear().toString();
        console.log('PAAP Comp An',rol,id_comp);
          let idc = (rol==="Achizitii")? 0:id_comp;
          axios.get(process.env.host+'paap/paapintegral/'+idc+'/'+an,{headers:{"Authorization" : `Bearer ${token}`}}).then(

              res => {
                console.log('Rspuns la tot paap-ul',res);
                this.paap=[];
                this.paap = [...res.data.paap];
              }
            ).catch(err =>{})  
    },
    computed:{
      
    },
    mounted(){
  
    },
    methods:{
            
    }
}

</script>

<style lang="sass" scoped>
.coloana-dreapta 
  border-left: 1px solid grey;


.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 720px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>