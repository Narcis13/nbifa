<template>

<q-page padding>
    <div class="flex flex-center column ">
    <q-btn v-if="vreauGrid" icon="create" @click="docNou" color="secondary" flat label="Document nou..." class="q-mb-md" />
    <q-table
      v-if="vreauGrid"
      title="Treats"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="name"
    />
    </div>
    <div class="row">
        <div v-if="vreauLista" class="col-3 q-pa-sm" >
             <q-scroll-area style="height: 85vh; ">
                <q-list v-for="d in data" :key="d.name" bordered separator >


                <q-item clickable v-ripple>
                    <q-item-section>
                    <q-item-label overline>{{d.name}}</q-item-label>
                    <q-item-label>{{d.calories}}</q-item-label>
                     <q-item-label>Calciu: {{d.calcium}}</q-item-label>
                    </q-item-section>
                </q-item>
                </q-list>
             </q-scroll-area>
        </div>
        <div v-if="vreauFormular" id="formular" class="col-9 q-pa-sm">
            <div class="row justify-around items-start content-start">

                 <q-select outlined v-model="tipmaterial" :options="tipurirepere" label="Tip material" />   

                <q-select outlined use-input  input-debounce="0" v-model="tipdocument" :options="tipuridocumente" @input="tipdocumentselectat" label="Tip document" style="min-width:200px;"/>

                <q-input outlined v-model="date" mask="date" :rules="['date']" >
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-input outlined v-model="text" label="Nr. document" style="max-width:140px;"/>
            </div>

            <q-splitter
                    v-model="splitterModel"
                    style="margin-top: 25px;" 
                  >

                    <template v-slot:before>
                      <q-tabs
                        v-model="tab"
                        class="text-teal"
                      >
                        <q-tab v-if="iesirivizibile" name="mails" icon="mail" label="Iesire" />
                        <q-tab v-if="intrarivizibile" name="alarms" icon="alarm" label="Intrare" />
                      </q-tabs>

                          <q-tab-panels
                            v-model="tab"
                            animated
                            transition-prev="jump-up"
                            transition-next="jump-up"
                          >
                            <q-tab-panel name="mails">
                               <div class="q-gutter-sm  column">
                                      <q-select
                                        filled
                                        dense
                                        v-model="lociesire"
                                        use-input
                                        hide-selected
                                        fill-input
                                        input-debounce="0"
                                        label="Loc dispunere"
                                        :options="locuriiesire"
                                        @filter="filterEFn"

                                        style="width: 225px;"
                                      >
                                        <template v-slot:no-option>
                                          <q-item>
                                            <q-item-section class="text-grey">
                                              No results
                                            </q-item-section>
                                          </q-item>
                                        </template>
                                    </q-select>

                                    <q-select
                                        outlined
                                        v-model="categoriee"
                                        dense
                                        label="Categorie reper"
                                        :options="categorii"
                                        style="width: 225px; "
                                      >

                                    </q-select>

                                    <q-select
                                      filled
                                      v-model="materialiesire"
                                      use-input
                                      hide-selected
                                      dense
                                      fill-input
                                      input-debounce="0"
                                      label="Denumire"
                                      :options="materialeiesire"
                                      style="width:225px;"
                                      @filter="filterMEFn"
                                      @input="MaterialIesireSelectat"
                                      
                                    
                                    >
                                      <template v-slot:no-option>
                                        <q-item>
                                          <q-item-section class="text-grey">
                                            No results
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                  </q-select>  

                                  <q-select dense outlined v-model="staremateriale" :options="starimaterial" label="Stare material" style="width:225px;"/>  

                               </div>
                            </q-tab-panel>

                            <q-tab-panel name="alarms">
                               <div class="q-gutter-sm  column">
                                      <q-select
                                        filled
                                        dense
                                        v-model="locintrare"
                                        use-input
                                        hide-selected
                                        fill-input
                                        input-debounce="0"
                                        label="Loc dispunere"
                                        :options="locuriintrare"
                                        @filter="filterIFn"

                                        style="width: 225px;"
                                      >
                                        <template v-slot:no-option>
                                          <q-item>
                                            <q-item-section class="text-grey">
                                              No results
                                            </q-item-section>
                                          </q-item>
                                        </template>
                                    </q-select>

                                    <q-select
                                        outlined
                                        v-model="categoriei"
                                        dense
                                        label="Categorie reper"
                                        :options="categorii"
                                        style="width: 225px; "
                                      >

                                    </q-select>

                                    <q-select
                                      filled
                                      v-model="materialintrare"
                                      use-input
                                      hide-selected
                                      dense
                                      fill-input
                                      input-debounce="0"
                                      label="Denumire"
                                      :options="materialeintrare"
                                      style="width:225px;"
                                      @filter="filterMIFn"
                                      @input="MaterialIntrareSelectat"
                                    
                                    >
                                      <template v-slot:no-option>
                                        <q-item>
                                          <q-item-section class="text-grey">
                                            No results
                                          </q-item-section>
                                        </q-item>
                                      </template>
                                  </q-select>  

                                  <q-select dense outlined v-model="staremateriali" :options="starimaterial" label="Stare material" style="width:225px;"/>                               
                               </div>
                              
                            </q-tab-panel>

                          </q-tab-panels>  
                          
                          <div class="q-gutter-sm q-pa-md column">
                          
                              <q-input  readonly filled v-model="um" label="UM" style="width:100px;" :dense="dense" />
                              <q-input  filled v-model="cantitate" label="Cantitate" style="width:150px;" :dense="dense" />
                              <q-input  filled v-model="pretunitar" label="Pret" style="width:150px;" :dense="dense" />
                              <div class="text-h6 ">Valoare</div>
                              <div class="column q-pa-md items-center">
                                    
                                    <q-btn  icon="create"  color="secondary" flat label="Adauga" />
                              </div>
                           </div>                  
                    </template>

                    <template v-slot:after>
                      <div class="q-pa-md"><Repere /></div>
                        
                    </template>

            </q-splitter>
            <div class="row q-pa-md justify-center">
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Salveaza"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Reset"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Documente..."  />

            </div>
                    
        </div>

    </div>

</q-page>
</template>

<script>
import Repere from '../components/Repere'
import axios from 'axios'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
var locuri=[],materiale=[];

export default {
  components:{
    'Repere':Repere
  },
  data () {
    return {
            tab: 'mails',
        splitterModel: 20,
        um:'buc',
        pretunitar:0,
        cantitate:0,
        tipdocument:null,
        lociesire:null,
        locintrare:null,
        materialintrare:null,
        materialiesire:null,
        materialeintrare:materiale,
        materialeiesire:materiale,
        tipuridocumente:[],
        locuriintrare:locuri,
        locuriiesire:locuri,
        tipmaterial:'MATERIALE',
        staremateriali:'NOU',
        staremateriale:'NOU',
        categoriee:null,
        categoriei:null,
        categorii:[],
        tipoperatiune:'in',
        vreauGrid:true,
        dense:true,
        vreauLista:false,
        vreauFormular:false,
        model: null,
        date: '2019/02/01',
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      tipurirepere:['MATERIALE', 'OBIECTE INVENTAR', 'MIJLOACE FIXE'],
      starimaterial:['NOU', 'FOLOSIT', 'CASARE'],
            pagination: {
                sortBy: 'name',
                descending: false,
                page: 1,
                rowsPerPage: 10
                // rowsNumber: xx if getting data from a server
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
     const token=this.$store.getters.token;

      axios.get(process.env.host+'documente/tipuridocumente',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate tipurile de docs',res.data.tipuridocs);
           res.data.tipuridocs.map(td=>{
             this.tipuridocumente.push({
               id:td.id,
               label:td.denumire,
               value:td.tip
             })
           })
           this.tipdocument=this.tipuridocumente[0];
          // this.gestiuni=[...res.data.gestiuni]
        }
      ).catch(err =>{})

      axios.get(process.env.host+'locuri/toatelocurile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate locurile',res.data.locuri);
           res.data.locuri.map(loc=>{
             this.locuriintrare.push({
               id:loc.id,
               label:loc.denumire,
               value:loc.id
             })
           })
           this.locuriiesire=[...this.locuriintrare];
           locuri=[...this.locuriintrare];
           this.lociesire=locuri[0];
           this.locintrare=locuri[0];
        }
      ).catch(err =>{})

      //materiale
        axios.get(process.env.host+`materiale/toate/${this.$store.getters.gestiuneCurenta.id}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate materialele',res.data);
           res.data.materiale.map(m=>{
             this.materialeintrare.push({
               id:m.id,
               label:m.denumire,
               value:m.id,
               um:m.um,
               pretpredefinit:m.pretpredefinit
             })
           })
           this.materialeiesire=[...this.materialeintrare];
           materiale=[...this.materialeintrare];

        }
      ).catch(err =>{})

      axios.get(process.env.host+`categ/categoriilegestiunii/${this.$store.getters.gestiuneCurenta.id}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate locurile',res.data.locuri);
          // this.categorii=[...res.data.categorii]
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
  computed:{
      intrarivizibile(){
          return this.tipdocument.value==='i'||this.tipdocument.value==='t'
      },
      iesirivizibile(){
          return this.tipdocument.value==='e'||this.tipdocument.value==='t'
      }
  },
  methods:{
      docNou(){
          this.vreauGrid=false;
          this.vreauLista=true;
          this.vreauFormular=true;
      },
      tipdocumentselectat(){
          console.log('Selectat',this.tipdocument);
      },
      MaterialIntrareSelectat(value){
        console.log('material intrare selectat',value);
           this.um=value.um;
           this.pretunitar=value.pretpredefinit;

      },
      MaterialIesireSelectat(value){
           this.um=value.um;
      },
      clickDocumente(){
          this.vreauGrid=true;
          this.vreauLista=false;
          this.vreauFormular=false;
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
    },
       filterEFn (val, update, abort) {
        if (val.length < 2) {
                  abort()
                  return
           }
          update(() => {
            const needle = val.toLowerCase()
            this.locuriiesire = locuri.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          })
    }   ,
     filterMIFn (val, update, abort) {
        if (val.length < 2) {
                  abort()
                  return
           }
          update(() => {
            const needle = val.toLowerCase()
            this.materialeintrare = materiale.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          })
    },
      filterMEFn (val, update, abort) {
        if (val.length < 2) {
                  abort()
                  return
           }
          update(() => {
            const needle = val.toLowerCase()
            this.materialeiesire = materiale.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
          })
    }  
  }
}
</script>
<style scoped>
#formular {
    border:2px solid black;
}
</style>