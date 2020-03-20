<template>

<q-page padding>
    <div class="flex flex-center column ">
  
    <bara-interval-documente ref="barainterval" v-if="vreauGrid" @new-data="newData" />
    <q-table
      v-if="vreauGrid"
      dense
      separator="cell"
      :data="documente"
      :columns="columns"
      :filter="filter"
      :pagination.sync="pagination"
      row-key="id"
      selection="single"
      :selected.sync="documenteselectate"
      no-data-label="Niciun document in intervalul selectat!"
    >
                      <template v-slot:top>
                          
                          <q-btn class="on-right" flat dense color="primary"  label="Sterge" @click="stergDoc" />
                          <q-btn class="on-right" flat dense color="green"  :label="lblPrint" @click="raportDocInterval" />
                          <q-space />
                          <q-input  dense debounce="300" color="primary" v-model="filter">
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                      </template>
                      <template v-slot:bottom-row>
                        <q-tr>
                          <q-td style="text-align: center;" colspan="100%">
                            Total debit: {{totaldebit}} lei    |    Total credit: {{totalcredit}} lei 
                          </q-td>
                        </q-tr>
                     </template>
    </q-table>
    </div>

    <q-page-sticky v-if="vreauGrid" position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent" @click="docNou"  />
    </q-page-sticky>


    <div class="row">
        <div v-if="vreauLista" class="col-2 q-pa-sm" >
             <q-scroll-area style="height: 85vh; ">
                <q-list v-for="d in documente" :key="d.id" bordered separator >


                <q-item clickable v-ripple>
                    <q-item-section>
                    <q-item-label overline>{{d.tipoperatiune}} {{d.nrdoc}}</q-item-label>
                    <q-item-label>{{d.data}}</q-item-label>


                            <q-item-label>{{d.valoare}} lei</q-item-label>

                    
                    </q-item-section>
                    <q-item-section side>
                                <q-icon color="primary" :name="d.icon" />
                    </q-item-section>
                </q-item>
                </q-list>
             </q-scroll-area>
        </div>
        <div v-if="vreauFormular" id="formular" class="col-10 q-pa-sm">
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
                        style="width:240px"
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
                                      :readonly="eTransfer"
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
                      <div class="q-pa-md" style="min-width:450px"><Repere :repere="repere"/></div>
                        
                    </template>

            </q-splitter>
            <div class="row q-pa-md justify-center">
              <q-btn :disable="!PotAdaugaDocument" icon="create" @click="salveaza" color="secondary" flat label="Salveaza"  />
              <q-btn  icon="create" @click="schimbaGestiunea" color="secondary" flat label="Reset"  />
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
        filter:'',
        um:'buc',
        nrdoc:" ",
        pretunitar:0,
        cantitate:0,
        tipdocument:null,
        lociesire:null,
        locintrare:null,
        documenteselectate:[],
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
        {name:'id',field:'id'},
        { name: 'tipoperatiune', align: 'left', label: 'Tip document', field: 'tipoperatiune', sortable: true },
        { name: 'data', label: 'Data document', field: 'data', sortable: true,format: (val, row) => date.formatDate(val, 'DD/MM/YYYY') },
        { name: 'nrdoc', label: 'Numar document', field: 'nrdoc' },
        { name: 'debit', label: 'DEBIT', field: 'debit',format: (val, row) => parseFloat(val).toFixed(2) },
        { name: 'credit', label: 'CREDIT', field: 'credit' ,format: (val, row) => parseFloat(val).toFixed(2)},
        { name: 'datamodificare', label: 'Ultima modificare', field: 'datamodificare' ,format: (val, row) => date.formatDate(val, 'DD/MM/YYYY HH:mm')}
      ]

    }
  },
  created(){
    let timeStamp = Date.now()
    this.datadoc= date.formatDate(timeStamp, 'DD/MM/YYYY');
     const token=this.$store.getters.token;
     this.$root.$on('materialadaugat',this.materialAdaugat)
     this.$root.$on('schimbgestiunea',this.schimbaGestiunea)

     
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
      beforeDestroy(){
         this.$root.$off('schimbgestiunea',this.schimbaGestiunea)
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
      lblPrint(){
         return this.documenteselectate.length===0?'Printeaza toate':'Printeaza'    
      },
      eTransfer(){
           return this.tipdocument.value==="t"
      },
      totaldebit(){
        let t=0;
        this.documente.map(d=>{
          t+=parseFloat(d.debit)
        })
        return t.toFixed(2);
      },
      totalcredit(){
        let t=0;
        this.documente.map(d=>{
          t+=parseFloat(d.credit)
        })
        return t.toFixed(2);
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
      docNou(){
          this.vreauGrid=false;
          this.vreauLista=true;
          this.vreauFormular=true;
      },
      salveaza(){
        const token=this.$store.getters.token;
        var that=this;
        let tip=that.tipdocument.value;
        let data = date.extractDate(this.datadoc, 'DD/MM/YYYY')
        let datacorecta=date.formatDate(data, 'YYYY-MM-DD');
        console.log('Data doc', datacorecta,this.$store.getters.gestiuneCurenta.id);

        axios.post(process.env.host+'documente/documentnou',{
            "idtipoperatiuni":this.tipdocument.id,
             "tipoperatiune":this.tipdocument.scurta,
            "data":datacorecta,
            "nrdoc":this.nrdoc,
            "idgestiune":this.$store.getters.gestiuneCurenta.id,
            "stare":"ACTIV"
        },{headers:{"Authorization" : `Bearer ${token}`}}).then(
            res => {
              console.log('Am primit raspunsul de la adaug antet documente,',res,that.materialintrare)
              // aici procesez raspunsul de la adaug documente CICLEZ PRIN REPERE....
              let info={};
              
              var antet=res.data;
              let tranzactii=[];
              if(tip==="t"){
                //transfer
                    that.repere.map(r=>{

                       tranzactii.push({
                          id_categ_intrare:that.categoriei.value,
                          id_categ_iesire:that.categoriee.value,
                          idAntet:res.data.id,
                          id_reper:r.id_reper,
                          id_locintrare:that.locintrare.id,
                          id_lociesire:that.lociesire.id,
                          id_gestiune:that.$store.getters.gestiuneCurenta.id,
                          um:r.um,
                          cantitate:r.cantitate,
                          pret:r.pret,
                          valoare:r.valoare,
                          stare_material_intrare:that.staremateriali,
                          stare_material_iesire:that.staremateriale,
                          tip
                       })

                    })

              } else
              {
                that.repere.map(r=>{
                 tranzactii.push({
                          id_categ_intrare:tip=="i"?r.id_categ:null,
                          id_categ_iesire:tip!=="i"?r.id_categ:null,
                          idAntet:res.data.id,
                          id_reper:r.id_reper,
                          id_locintrare:tip=="i"?that.locintrare.id:null,
                          id_lociesire:tip!=="i"?that.lociesire.id:null,
                          id_gestiune:that.$store.getters.gestiuneCurenta.id,
                          um:r.um,
                          cantitate:r.cantitate,
                          pret:r.pret,
                          valoare:r.valoare,
                          stare_material_intrare:tip=="i"?that.staremateriali:null,
                          stare_material_iesire:tip!=="i"?that.staremateriale:null,
                          tip
                })
              })
              }

              console.log('de postat',tranzactii);
              axios.post(process.env.host+'documente/tranzactienoua',{
                    tranzactii
              },{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{
                          this.$q.notify({
                                          message:`Tranzactia a fost adaugata cu succes!`,
                                          timeout:1500,
                                          position:'top',
                                          color:'positive'
                         })
                         let val=0;
                         that.repere.map(r=>{
                              val+=parseFloat(r.valoare);
                         })
                         that.repere=[];
                        // that.resetRepere();
                         //that.resetLocCategorieStare();
                         //console.log('ma pregatest sa adaug documentul cu antetul ',antet);
                         let iconText=tip==="t"?'refresh':(tip==="i")?'subdirectory_arrow_right':'subdirectory_arrow_left'
                         that.documente.push({
                                            id:antet.id,
                                            idtipoperatiuni:that.tipdocument.id,
                                            tipoperatiune:that.tipdocument.scurta,
                                            data:datacorecta,
                                            nrdoc:that.nrdoc,
                                            idgestiune:that.$store.getters.gestiuneCurenta.id,
                                            valoare:val,
                                            icon:iconText,
                                          //  datacreere:antet.datacreere,
                                         //   datamodificare:antet.datamodificare,
                                            stare:"ACTIV"
                         })
                         that.nrdoc=" ";
                         that.tipdocument=that.tipuridocumente[0];
                         that.tipmaterial={label:'MATERIALE', value:'M'}
                         that.schimbTipMaterial();


              }).catch(err=>{
                
              })
              



            }
       ).catch(err=>{
             console.log('Eroare.............',err)
              this.$q.notify({
                    color: 'negative',
                    timeout:1500,
                    position:'top',
                    icon: 'delete',
                    message: `ATENTIE! `
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
           if(this.tipdocument.value==="t") this.materialintrare=value;
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
             nrcrt:this.repere.length+1,
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
    raportDocInterval(){
      const token=this.$store.getters.token;
  
         if(this.documenteselectate.length===0){
              this.$refs.barainterval.raportToateDocumentele(this.$store.getters.gestiuneCurenta.id);
         }
         else
         {

         }
    },
    stergDoc(){
            const token=this.$store.getters.token;
            var that = this;
             if(this.documenteselectate.length==1){
                  
                   console.log('doc selectat', this.documenteselectate[0]);

                axios.patch(process.env.host+`documente/${this.documenteselectate[0].id}`,{}
                ,{headers:{"Authorization" : `Bearer ${token}`}}).then(
                      res => {
           
                         //aici trebuie cumva sa scot documentul din array that.categorii = removeByKey(that.categorii,{key:'id',value:that.selected[0].id});
                          that.documente.some(function(item, index) {
                              return ( that.documente[index]["id"] === that.documenteselectate[0].id) ? !!( that.documente.splice(index, 1)) : false;
                          }); 
                          this.$q.notify({
                                message:`Documentul selectat a fost invalidat!`,
                                timeout:1500,
                                position:'top',
                                color:'positive'
                        })
                })

             }
             else {
                   this.$q.notify({
                    color: 'negative',
                    timeout:1500,
                    position:'top',
                    icon: 'delete',
                    message: `Selectati un document`
                  })
             }
    },
    newData(d){
           this.documente=[];
           
           this.documente=[...d];
           for(var i=0;i<this.documente.length;i++){
             if (this.documente[i].debit==this.documente[i].credit){
               this.documente[i].valoare=parseFloat(this.documente[i].debit).toFixed(2);
               this.documente[i].icon='refresh'
             }
             else if(this.documente[i].debit>0){
               this.documente[i].valoare=parseFloat(this.documente[i].debit).toFixed(2);
               this.documente[i].icon='subdirectory_arrow_right';
             } else {
               this.documente[i].valoare=parseFloat(this.documente[i].credit).toFixed(2);
               this.documente[i].icon='subdirectory_arrow_left';
             }

           }
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
    } ,
    schimbaGestiunea(id){

       this.$refs.barainterval.schimbaGestiunea(id);
    } 
  }
}
</script>
<style scoped>
#formular {
    border:2px solid black;
}
</style>