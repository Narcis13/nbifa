<template>
<q-page padding>
    <div class="flex flex-center column ">
        <div class="row q-pa-md">
          <q-select  @input="schimbTipMaterial" outlined v-model="tipmaterial" :options="tipurirepere" label="Tip material" /> 
          <div class="column q-pa-md">
                <q-toggle v-model="toatecategoriile" color="green" label="Toate categoriile"  />
                <q-select
                      outlined
                      v-if="!toatecategoriile"
                      v-model="categoriei"
                      dense
                      label="Categorie reper"
                      :options="categorii"
                      style="width: 175px; "
                >

                </q-select>

          </div>

          <div class="column q-pa-md">
                <q-toggle v-model="toatelocurile" color="green" label="Toate locurile"  />
                 <q-select
                     filled
                     v-if="!toatelocurile"
                     dense
                     v-model="locselectat"
                     use-input
                     hide-selected
                     fill-input
                     input-debounce="0"
                     label="Loc dispunere"
                     :options="locuriintrare"
                     @filter="filterIFn"
                      style="width: 175px;"
                    >
                                        <template v-slot:no-option>
                                          <q-item>
                                            <q-item-section class="text-grey">
                                              Niciun rezultat
                                            </q-item-section>
                                          </q-item>
                                        </template>
                                    </q-select>

          </div>

          <div class="column q-pa-md">
                <q-toggle v-model="toatestarile" color="green" label="Toate starile"  />
                <q-select v-if="!toatestarile" dense outlined v-model="staremateriali" :options="starimaterial" label="Stare material" style="width:175px;"/>

          </div>      
          <div class="column q-pa-md">
              <q-btn-dropdown  rounded color="secondary" label="Perioada" >
                    <!-- dropdown content goes here -->
                <q-card >
                  <q-card-section>
                      <q-input filled label="De la" v-model="datainceput" mask="date" :rules="['date']">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                              <q-date v-model="datainceput" @input="() => $refs.qDateProxy1.hide()" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                      <q-input filled label="La" v-model="datasfirsit" mask="date" :rules="['date']">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                              <q-date v-model="datasfirsit" @input="() => $refs.qDateProxy2.hide()" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </q-card-section>

                  <q-card-actions vertical>
                    <q-btn flat v-close-popup >Selecteaza</q-btn>

                  </q-card-actions>
                </q-card>
                  </q-btn-dropdown>
              <div class="q-pa-sm text-bold">
                   {{datainceput}} : {{datasfirsit}}
              </div>
          </div>  

        </div> 
        <!-- Aici vine divul cu butoanele -->
       <div class="q-pa-md flex flex-center column ">
            <q-btn-group rounded>
              <q-btn color="amber" rounded glossy icon-right="update" label="BALANTA ANALITICA DE GESTIUNE" />
              <q-btn color="amber" rounded glossy icon-right="update" label="LISTA DE INVENTARIERE" />
            </q-btn-group>
       </div>
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="name"
    />


    </div>
</q-page>
</template>

<script>
import axios from 'axios';
var locuri=[];
export default {
  data () {
    return {
       tipurirepere:[{label:'MATERIALE', value:'M'}, {label:'OBIECTE INVENTAR',value:'OB'}, {label:'MIJLOACE FIXE',value:'MF'}],
        tipmaterial:{label:'MATERIALE', value:'M'},
        toatecategoriile:true,
        toatelocurile:true,
        toatestarile:true,
        locselectat:null,
        categoriei:null,
        locuriintrare:[],
        datainceput: '2020/04/01',
        datasfirsit:'2020/04/27',
        starimaterial:['NOU', 'FOLOSIT', 'CASARE'],
        staremateriali:'NOU',
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
      const token=this.$store.getters.token;

       axios.get(process.env.host+'locuri/toatelocurile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate locurile',res.data.locuri);
           this.locuriintrare=[];
           locuri=[];
           res.data.locuri.map(loc=>{
             this.locuriintrare.push({
               id:loc.id,
               label:loc.denumire,
               value:loc.id
             })
           })
           locuri=[...this.locuriintrare];
           this.locselectat=this.locuriintrare[0];
        }
      ).catch(err =>{})

      this.categoriiPerGestiunePerTip()
  },
  methods:{
    categoriiPerGestiunePerTip(){
       const token=this.$store.getters.token;

       axios.get(process.env.host+`categ/categoriilegestiunii/${this.$store.getters.gestiuneCurenta.id}/${this.tipmaterial.value}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
          // console.log('Raspuns la toate locurile',res.data.locuri);
          // this.categorii=[...res.data.categorii]
          this.categorii=[];
           res.data.categorii.map(c=>{
             this.categorii.push({
               id:c.id,
               label:c.denumire,
               value:c.id
             })
           })
        }
      ).catch(err =>{})

      },
     schimbTipMaterial(){
            console.log('schimb tip material', this.tipmaterial)
           this.categoriiPerGestiunePerTip();
  
      },
          filterIFn (val, update, abort) {
            if (val.length < 2) {
                      abort()
                      return
              }
              update(() => {
                const needle = val.toLowerCase()
                this.locuriintrare = locuri.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
              })
          }
  }
}
</script>


