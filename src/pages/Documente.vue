<template>

<q-page padding>
    <div class="flex flex-center column ">
  
    <bara-interval-documente v-if="vreauGrid" />
    <q-table
      v-if="vreauGrid"
      :data="documente"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="name"
    />
    </div>

    <q-page-sticky v-if="vreauGrid" position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent" @click="docNou"  />
    </q-page-sticky>


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

                 <q-select @input="schimbTipMaterial" outlined v-model="tipmaterial" :options="tipurirepere" label="Tip material" />   

                <q-select outlined use-input  input-debounce="0" v-model="tipdocument" :options="tipuridocumente" @input="tipdocumentselectat" label="Tip document" style="min-width:200px;"/>

                <q-input outlined readonly v-model="datadoc"   >
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date  mask="DD/MM/YYYY" v-model="datadoc" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-input outlined v-model="nrdoc" label="Nr. document" style="max-width:140px;" :rules="[
                                    val => val !== null && val !== '' || 'Cimpul nu poate fi vid!'
                              ]"/>
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
                        <q-tab v-if="iesirivizibile" name="tabiesiri" icon="mail" label="Iesire" />
                        <q-tab v-if="intrarivizibile" name="tabintrari" icon="alarm" label="Intrare" />
                      </q-tabs>

                          <q-tab-panels
                            v-model="tab"
                            animated
                            transition-prev="jump-up"
                            transition-next="jump-up"
                          >
                            <q-tab-panel name="tabiesiri">
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

                            <q-tab-panel name="tabintrari">
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
                                              Niciun rezultat
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
                                      clearable
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
                                            Material inexistent
                                             <material-add :data="materialeintrare" @materialnou="materialAdaugat"/>
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
                              <q-input  type="number" filled v-model.number="cantitate" label="Cantitate" style="width:150px;" :dense="dense"         :rules="[
                                    val => val !== null && val !== '' || 'Introduceti cantitatea',
                                     val => val > 0 || 'Cantitatea nu poate fi negativa'
                              ]"/>
                              <q-input type="number" filled v-model.number="pretunitar" label="Pret" style="width:150px;" :dense="dense" :rules="[
                                    val => val !== null && val !== '' || 'Introduceti pretul unitar'
                              ]"/>
                              <div class="text-h6 ">{{valoareunitara}} lei</div>
                              <div class="column q-pa-md items-center">
                                    
                                    <q-btn  :disable="!PotAdaugaReper" icon="create"  color="secondary" flat label="Adauga" @click="AdaugaReper"/>
                              </div>
                           </div>                  
                    </template>

                    <template v-slot:after>
                      <div class="q-pa-md" style="min-width:600px"><Repere :repere="repere"/></div>
                        
                    </template>

            </q-splitter>
            <div class="row q-pa-md justify-center">
              <q-btn :disable="!PotAdaugaDocument" icon="create" @click="salveaza" color="secondary" flat label="Salveaza"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Reset"  />
              <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Documente..."  />

            </div>
                    
        </div>

    </div>

</q-page>
</template>

<script>
import { date } from 'quasar'
import Repere from '../components/Repere'
import MaterialAdd from '../components/MaterialAdd'
import BaraIntervalDocumente from '../components/BaraIntervalDocumente'
import axios from 'axios'
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
var locuri=[],materiale=[];

export default {
  components:{
    'Repere':Repere,
    'material-add':MaterialAdd,
    'bara-interval-documente':BaraIntervalDocumente
  },
  data () {
    return {
            tab: 'tabintrari',
        splitterModel: 20,
        um:'buc',
        nrdoc:" ",
        pretunitar:0,
        cantitate:0,
        tipdocument:null,
        lociesire:null,
        locintrare:null,
        documente:[],
        repere:[],
        materiale:[],
        materialintrare:null,
        materialiesire:null,
        materialeintrare:materiale,
        materialeiesire:materiale,
        tipuridocumente:[],
        locuriintrare:locuri,
        locuriiesire:locuri,
        tipmaterial:{label:'MATERIALE', value:'M'},
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
        datadoc: null,
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
      tipurirepere:[{label:'MATERIALE', value:'M'}, {label:'OBIECTE INVENTAR',value:'OB'}, {label:'MIJLOACE FIXE',value:'MF'}],
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
      ]

    }
  },
  created(){
    let timeStamp = Date.now()
    this.datadoc= date.formatDate(timeStamp, 'DD/MM/YYYY');
     const token=this.$store.getters.token;
     this.$root.$on('materialadaugat',this.materialAdaugat)

     
      axios.get(process.env.host+'documente/tipuridocumente',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate tipurile de docs',res.data.tipuridocs);
           res.data.tipuridocs.map(td=>{
             this.tipuridocumente.push({
               id:td.id,
               label:td.denumire,
               value:td.tip,
               scurta:td.denumire_scurta
             })
           })
           this.tipdocument=this.tipuridocumente[0];
          // this.gestiuni=[...res.data.gestiuni]
        }
      ).catch(err =>{})

      axios.get(process.env.host+'locuri/toatelocurile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate locurile',res.data.locuri);
           this.locuriintrare=[];
           this.locuriiesire=[];
           locuri=[];
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
           this.materialeintrare=[];
           this.materialeiesire=[];
           materiale=[];
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

       this.categoriiPerGestiunePerTip();
  },
  computed:{
      intrarivizibile(){
          return this.tipdocument.value==='i'||this.tipdocument.value==='t'
      },
      iesirivizibile(){
          return this.tipdocument.value==='e'||this.tipdocument.value==='t'
      },
      valoareunitara(){
        return 'Valoare: '+(this.pretunitar*this.cantitate).toFixed(2);
      },
      doarvaloare(){
        return (this.pretunitar*this.cantitate).toFixed(2);
      },
      PotAdaugaReper(){
        return (this.categoriei||this.categoriee)&&(this.materialintrare||this.materialiesire)&&this.cantitate>0
      },
      PotAdaugaDocument(){
        return this.repere.length>0&&this.nrdoc.length>1
      }
  },
  methods:{
      categoriiPerGestiunePerTip(){
       const token=this.$store.getters.token;

       axios.get(process.env.host+`categ/categoriilegestiunii/${this.$store.getters.gestiuneCurenta.id}/${this.tipmaterial.value}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Raspuns la toate locurile',res.data.locuri);
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
      docNou(){
          this.vreauGrid=false;
          this.vreauLista=true;
          this.vreauFormular=true;
      },
      salveaza(){
        const token=this.$store.getters.token;
        let data = date.extractDate(this.datadoc, 'DD/MM/YYYY')
        let datacorecta=date.formatDate(data, 'YYYY-MM-DD');
        console.log('Data doc', datacorecta,this.repere,this.tipdocument);

        axios.post(process.env.host+'documente/documentnou',{
            "idtipoperatiuni":this.tipdocument.id,
             "tipoperatiune":this.tipdocument.scurta,
            "data":datacorecta,
            "nrdoc":this.nrdoc,
            "stare":"ACTIV"
        },{headers:{"Authorization" : `Bearer ${token}`}}).then(
            res => {
              console.log('Am primit idul,',res.data,numenou)
              // aici procesez raspunsul de la adaug documente
              
              



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

      },
      materialAdaugat(e){
        console.log('Material Adaugat...',e)
           let mat_nou={
               id:e.id,
               label:e.denumire,
               value:e.id,
               um:e.um,
               pretpredefinit:e.pretpredefinit
             };

             this.materialeintrare.push(mat_nou);
             materiale.push(mat_nou);
             this.materialintrare=mat_nou;
      },
      tipdocumentselectat(){
          console.log('Selectat',this.tipdocument);
          if(this.tipdocument.value=="e"||this.tipdocument.value=="t"){
            this.tab="tabiesiri";
          }
          else
            this.tab="tabintrari";
            this.resetRepere();
            this.resetLocCategorieStare();
      },
      MaterialIntrareSelectat(value){
        console.log('material intrare selectat',value);
           this.um=value.um;
           this.pretunitar=value.pretpredefinit;

      },
      MaterialIesireSelectat(value){
           this.um=value.um;
      },
      schimbTipMaterial(){
          console.log('schimb tip material', this.tipmaterial)
           this.categoriiPerGestiunePerTip();
           this.resetRepere();
           this.resetLocCategorieStare();
      },
      clickDocumente(){
          this.vreauGrid=true;
          this.vreauLista=false;
          this.vreauFormular=false;
      },
      AdaugaReper(){
      
           this.repere.push({
             categ:this.tipdocument.value==='i'? this.categoriei.label:this.categoriee.label,
             id_categ:this.tipdocument.value==='i'? this.categoriei.value:this.categoriee.value,
             denumire_reper:this.tipdocument.value==='i'? this.materialintrare.label:this.materialiesire.label,
             id_reper:this.tipdocument.value==='i'? this.materialintrare.value:this.materialiesire.value,
             um:this.um,
             cantitate:this.cantitate,
             pret:this.pretunitar,
             valoare:this.doarvaloare
           })
           this.resetRepere();
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
    },
    resetRepere(){

      this.cantitate=1;
      this.pretunitar=0;
      this.materialintrare=null;
      this.materialiesire=null;
    },
    resetLocCategorieStare(){
        this.staremateriali='NOU';
        this.staremateriale='NOU';
        this.categoriee=null;
        this.categoriei=null;
        this.lociesire=locuri[0];
        this.locintrare=locuri[0];
    }  
  }
}
</script>
<style scoped>
#formular {
    border:2px solid black;
}
</style>