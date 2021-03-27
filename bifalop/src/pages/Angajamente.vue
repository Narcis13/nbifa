<template>
<q-page padding>
  <div  class="q-mt-sm flex flex-center">
    <q-table
      title="Angajamente"
      :filter="filter"
      :rows="state.angajamente"
      dense
      :columns="columns"
      row-key="id"
      selection="single"
      :pagination="initialPagination"
      v-model:selected="selected"
    >

        <template v-slot:top>
            <div class="q-pa-sm text-h6">Angajamente</div>
            <div class="row q-gutter-sm q-pa-sm q-ml-xl">
              <q-select class="col" style="min-width:200px;" filled v-model="perspectiva" :options="perspective" label="Perspectiva" stack-label dence options-dense />
               <div class="flex" style="min-width:200px;max-height:100px;">
                   <q-btn class="q-ma-sm" :disable="selected.length==0" round color="red" icon="delete_forever" >
                      <q-tooltip class="bg-accent">Sterge</q-tooltip>
                   </q-btn>
                  <q-btn class="q-ma-sm" round color="secondary" icon="print" >
                        <q-tooltip class="bg-accent">Printeaza</q-tooltip>
                   </q-btn>
                   <q-btn class="q-ma-sm" round color="amber" glossy text-color="black" icon="file_download" >
                        <q-tooltip class="bg-accent">Export CSV</q-tooltip>
                   </q-btn>
               </div>

            </div>

            <q-space />
            <q-input outlined dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
        </template>


      <template v-slot:header="props">
        <q-tr :props="props">
           <q-th auto-width />
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
              <q-checkbox  dense v-model="props.selected" ></q-checkbox>
           
          </q-td>
          <q-td auto-width>
              
            <q-btn v-if="props.row.nr>1" size="sm" color="accent" round dense @click="(props.expand = !props.expand)&&extinde(props)" :icon="props.expand ? 'remove' : 'add'" >
             
            </q-btn>
             <q-badge v-if="props.row.nr>1" color="red" floating transparent >{{props.row.nr}}</q-badge>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
          <q-checkbox  v-if="col.name=='viza'"  v-model="props.row.viza" disable dense  ></q-checkbox>
           <div v-else>{{ col.value }}</div> 
          </q-td>
        </q-tr>
        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%">
           <!-- <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div> -->
           <AngTimeLine />
          </q-td>
        </q-tr>
      </template>

    </q-table>


  </div>
  
   <q-dialog @show="showAngNou" v-model="adaug_angajament" persistent >
           <q-card style="width: 350px; max-width: 80vw;">
               <q-card-section>
                          <div class="text-h6">{{selected.length>0?`${actiuneModificareAngajament} angajament `+selected[0].nrdoc:'Angajament nou'}}</div><!--   sau suplimentare angajament -->
               </q-card-section>

                <q-card-section>
                    <q-select :disable="selected.length>0" dense outlined v-model="categorieSelectata" :options="state.categorii" label="Categoria" @popup-hide="categorieAleasa()">
                              <template v-slot:prepend>
                                   <q-icon name="category" />
                              </template>
                                  <template v-slot:option="scope">
                                              <q-item
                                                v-bind="scope.itemProps"
                                                v-on="scope.itemEvents"
                                              >

                                                <q-item-section>
                                                  <q-item-label >{{ scope.opt.label }} - {{ scope.opt.artbug }}</q-item-label>
                                                  <q-item-label >{{scope.opt.numecap}}</q-item-label>
                                                  
                                                </q-item-section>
                                              </q-item>
                                  </template>

                    </q-select>

                    <q-card dark bordered class="q-mt-sm bg-grey-9 my-card">
                      <q-card-section>
                        <div class="text-h6">{{numesursa}}</div>
                        <div class="text-subtitle2">Art. bug. {{articolbugetar}}</div>
                      </q-card-section>

                      <q-separator dark inset />

                      <q-card-section>
                        <div class="row">
                          <div class="col-7">Credite bug. aprobate </div>
                          <div class="col-5 text-right">{{credite_aprobate}} lei</div>
                        </div>
                        <div class="row">
                          <div class="col-7">Credite bug. angajate </div>
                          <div class="col-5 text-right">{{credite_angajate}} lei</div>
                        </div>
                        <div class="row">
                          <div class="col-7">Credite bug. disponibile </div>
                          <div class="col-5 text-right"><strong>{{credite_disponibile}} lei</strong></div>
                        </div>
                      </q-card-section>
                    </q-card>

                        <q-input :disable="!eCategoriaSelectata||selected.length>0" class="q-mt-sm" dense outlined v-model="dataAngajament" mask="date" :rules="['date']">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                              <q-date v-model="dataAngajament" :options="restrictieData">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Inchide" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>

                        <q-input :disable="!eCategoriaSelectata" dense v-model="detalii" autogrow outlined label="Detalii" />

                        <q-input
                        class="q-mt-sm"
                         :rules="[ val => val>0 || 'Valori mai mari ca 0, va rog!']"
                        :disable="!eCategoriaSelectata"
                          v-model.number="suma"
                          error-message="Suma invalida!" 
                          :error="!sumaValida"
                          type="number"
                          outlined
                          dense
                          :color="actiuneModificareAngajament==='Diminuare'? 'red':'blue'"
                          :label="actiuneModificareAngajament==='Diminuare'? 'Suma de dezangajat':'Suma de angajat'"
                        />

                </q-card-section>

               <q-card-actions align="right" class="bg-white text-teal">
                          <q-btn @click="resetAngNou" flat label="Abandon" v-close-popup />
                          <q-space />
                          <q-btn @click="angNou" :disable="!dateValide" flat :label="selected.length>0?`${actiuneModificareAngajament}`:'Adauga'"  />
               </q-card-actions>
           </q-card>

    </q-dialog>

        <q-page-sticky  position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent"  @click="(adaug_angajament=true)&&(actiuneModificareAngajament='Suplimentare')">
              <q-tooltip anchor="top start" self="center right" class="bg-accent">{{selected.length>0?'Suplimentare angajament':'Angajament nou'}}</q-tooltip>
            </q-btn>
    </q-page-sticky>
    <q-page-sticky  position="bottom-left" :offset="[24, 24]">
            <q-btn :disable="selected.length==0||selectatSiNevizat" fab icon="compress" color="red" @click="(adaug_angajament=true)&&(actiuneModificareAngajament='Diminuare')" >
              <q-tooltip anchor="top right" self="center left" class="bg-accent">Diminueaza angajament</q-tooltip>
            </q-btn>
    </q-page-sticky>
</q-page>

</template>

<script>
import { defineComponent , reactive,inject,ref,computed} from 'vue'
import AngTimeLine from 'components/AngTimeLine.vue'
import axios from 'axios'
import { date } from 'quasar'
//import AngTimeLine from '../components/AngTimeLine.vue'
const columns = [

  { name: 'nrdoc', align: 'center', label: 'Nr. doc.', field: 'nrdoc', sortable: true },
  { name: 'dataang', align: 'center', label: 'Data', field: 'dataang', sortable: true },
  { name: 'categorie', align: 'left',label: 'Categorie', field: 'categorie', sortable: true },
  { name: 'detalii', align: 'left',label: 'Detalii', field: 'detalii', sortable: true },
  { name: 'suma', align: 'right',label: 'Valoare', field: 'suma', sortable: true },
  { name: 'numecap', align: 'left',label: 'Capitol bug.', field: 'numecap', sortable: true },
  { name: 'artbug', align: 'center',label: 'Art. bug.', field: 'artbug', sortable: true },
  { name: 'viza', align: 'center',label: 'Viza CFPP', field: 'viza', sortable: true }
 
]

const  initialPagination = {
       // sortBy: 'desc',
       // descending: false,
        page: 1,
        rowsPerPage: 15

      }

const state = reactive(
  {
    angajamente : [],
    categorii:[]        
  }
  )

export default defineComponent({
  name: 'Angajamente',
  components:{
      AngTimeLine

  },
  setup(p,c){

    console.log('Setup Angajamente',p,c)
    const global=inject('global');
    const token=global.state.user.token;

    function toateAngajamentele(){
      axios.get(process.env.host+`angajamente/toate/${global.state.user.idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Raspuns la toate angajamentele',res.data);
           state.angajamente=[];
           res.data.angajamente[0].map(a=>{
             state.angajamente.push({
               artbug:a.artbug,
               codCap:a.codCap,
               compartiment:a.compartiment,
               dataang:date.formatDate(a.dataang, 'DD/MM/YYYY'),//a.dataang,
               detalii:a.detalii,
               idAntet:a.idAntet,
               id:a.id,
               categorie:a.categorie,
               viza:a.viza==1?true:false,
               nrdoc:a.nrdoc,
               idcateg:a.idcateg,
               idcompartiment:a.idcompartiment,
               nr:a.nr,
               numecap:a.numecap,
               stare:a.stare,
               suma:a.suma

             })
           })
    
        }
      ).catch(err =>{})
      }

      toateAngajamentele();

      axios.get(process.env.host+`angajamente/catbugetare/${global.state.user.idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Raspuns la categoriile compartimentului',res.data);
           state.categorii=[];
           res.data.categorii[0].map(c=>{

                        state.categorii.push({
                          value:c.id,
                          label:c.denumire,
                          codCap:c.codCap,
                          artbug:c.artbug,
                          numecap:c.numecap,
                          crediteangajate:c.crediteangajate,
                          crediteaprobate:c.crediteaprobate,
                          disponibil:c.disponibil
                        })

           })
    
        }
      ).catch(err =>{})

     let categorieSelectata = ref({label:'',value:0});
     let numesursa=ref('Sursa finantare: ? ')
     let articolbugetar=ref(' - ?')
     let credite_aprobate=ref(0)
     let credite_angajate=ref(0)
     let credite_disponibile=ref(0)
     let suma=ref(parseFloat('1').toFixed(2));
     let suma_max=ref(parseFloat('0').toFixed(2));
     let detalii=ref('');
     let dataAngajament=ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))
     let adaug_angajament=ref(false)
     let selected= ref([])
     let actiuneModificareAngajament = ref('nou')

     //computed properties
     let eCategoriaSelectata = computed(()=>{
       return credite_aprobate.value>0
     })

     let dateValide = computed(()=>{
       return credite_aprobate.value>0&&suma.value>0&&detalii.value.length>5
     })

     let sumaValida = computed(()=>{
       return suma.value!==''&&suma.value>0&&suma.value<=suma_max.value
     })

     let selectatSiNevizat = computed(()=>{
       return selected.value.length>0&&!selected.value[0].viza
     })

     //private methods
     function resetAngNou(){
       console.log('Reset ang nou')
       categorieSelectata.value = {label:'',value:0};
       numesursa.value='Sursa finantare: ? '
       articolbugetar.value=' - ?'
       credite_aprobate.value=0
       credite_angajate.value=0
       credite_disponibile.value=0
       suma.value=parseFloat('1').toFixed(2);
       detalii.value='';
       dataAngajament.value=date.formatDate(Date.now(), 'YYYY/MM/DD')
     }

     function categorieAleasa(c){
        console.log('Am selectat categoria',categorieSelectata.value)
        articolbugetar.value=categorieSelectata.value.artbug;
        numesursa.value=categorieSelectata.value.numecap;
        credite_aprobate.value=categorieSelectata.value.crediteaprobate
        credite_angajate.value=categorieSelectata.value.crediteangajate
        credite_disponibile.value=categorieSelectata.value.disponibil

      }

      function suplimentareAngajament(){
         let date_angajament={idAntet:selected.value[0].idAntet,
                       idcateg:categorieSelectata.value.value,
                       codCap:categorieSelectata.value.codCap,
                       numecap:categorieSelectata.value.numecap,
                       artbug:categorieSelectata.value.artbug,
                       ca:credite_aprobate.value,
                       cang:credite_angajate.value,
                       disp:credite_disponibile.value,
                       suma:actiuneModificareAngajament==='Diminuare'?0-suma.value: suma.value,
                       restdisp:credite_disponibile.value-suma.value,
                       stare:'activ',
                       idClient:8,
                       data_ang:dataAngajament.value}
           axios.post(process.env.host+'angajamente/angsuplimentare',date_angajament,{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{

                          resetAngNou();
                          adaug_angajament.value=false;
                          toateAngajamentele();

                                }).catch(err=>{
                                                            
                                })

      }

    return {
      initialPagination,
      selected,
      adaug_angajament,
      filter:ref(''),
      detalii,
      suma,
      dataAngajament,
      columns,
      numesursa,
      eCategoriaSelectata,
      dateValide,
      sumaValida,
      selectatSiNevizat,
      credite_aprobate,
      credite_angajate,
      credite_disponibile,
      articolbugetar,
      actiuneModificareAngajament,
      state,
      resetAngNou,
      categorieSelectata,
      perspectiva: ref( {label:'Angajamente an curent',value:1}),
      perspective: [
       {label:'Angajamente an curent',value:1},  {label:'Angajamente alta perioada',value:2}
      ],
      sterge(){
        state.rows.pop();
      },
      extinde(props){
        console.log('Ma extinde',props)
      },
      restrictieData (d) {
        var azi = new Date(); 
        var firstDay =  
                    new Date(azi.getFullYear(), azi.getMonth(), 1); 
        let datainceput=date.formatDate(firstDay, 'YYYY/MM/DD');
        return d >= datainceput //!!!! AICI NU TREBUIE SA FIE HARDCODED....tb sa fie prima zi a lunii curente
      },
      categorieAleasa,
      angNou(){

        if(selected.value.length>0){
          suplimentareAngajament();
        }
        else {
                  console.log('Adaug angajament',global.state.user.idcompartiment,token)
        
          axios.post(process.env.host+'angajamente/angnou',{
                    dataprop:dataAngajament.value,
                    tip:1,
                    detalii:detalii.value,
                    dataang:dataAngajament.value,
                    compID:global.state.user.idcompartiment,
                    viza:0,
                    aprob:0,
                    suma:suma.value,
                    stare:'ACTIV',
                    idClient:8
                    },{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{
                    

                       let date_angajament={idAntet:res.data.id,
                       idcateg:categorieSelectata.value.value,
                       codCap:categorieSelectata.value.codCap,
                       numecap:categorieSelectata.value.numecap,
                       artbug:categorieSelectata.value.artbug,
                       ca:credite_aprobate.value,
                       cang:credite_angajate.value,
                       disp:credite_disponibile.value,
                       suma:suma.value,
                       restdisp:credite_disponibile.value-suma.value,
                       stare:'activ',
                       idClient:8,
                       data_ang:dataAngajament.value}
                       

                        axios.post(process.env.host+'angajamente/angnoudetalii',date_angajament,{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{

                        console.log('Am salvat antet angajament',date_angajament)
                          resetAngNou();
                           adaug_angajament.value=false;
                          toateAngajamentele();

                                }).catch(err=>{
                                                            
                                })
                                               
                    }).catch(err=>{
                                    
                    })
        }

      },
      showAngNou(){
        if(selected.value.length>0){
            console.log('Show ang nou',selected.value[0],state.categorii)
            state.categorii.map(c=>{
              //    console.log('ajung aici',c)
              if(c.value==selected.value[0].idcateg){
                
                categorieSelectata.value=c;
                categorieAleasa();
                //dataAngajament.value=selected.value[0].dataang;
              }
        })
          if(actiuneModificareAngajament.value=='Diminuare'){
            //aici calculez cit pot diminua
            console.log('calculez diminuare')
            axios.get(process.env.host+`angajamente/calcdezangajare/${selected.value[0].idAntet}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

              res => {
                console.log('Raspuns la calcul dezangajare',res.data.suma_angajata[0][0].suma,parseFloat(selected.value[0].suma)-res.data.suma_angajata[0][0].suma);
                suma.value=parseFloat(selected.value[0].suma)-res.data.suma_angajata[0][0].suma;
                suma_max.value=parseFloat(selected.value[0].suma)-res.data.suma_angajata[0][0].suma;
          
              }
            ).catch(err =>{})


          }
        }
        

      }

    }
  }
})
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 334px
  margin:auto
.q-card__section 
    padding: 8px

</style>