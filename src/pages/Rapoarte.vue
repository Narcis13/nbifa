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
              <q-btn @click="genBalanta" color="amber" rounded glossy icon-right="update" label="BALANTA ANALITICA DE GESTIUNE" />
              <q-btn @click="genLI" color="amber" rounded glossy icon-right="update" label="LISTA DE INVENTARIERE" />
            </q-btn-group>
       </div>
       
      <lista-inventar v-if="afisezListaInventariere" />
      <balanta v-if="afisezBalanta" />


    </div>
</q-page>
</template>

<script>
import axios from 'axios';
import BalantaAnalitica from '../components/Balanta'
import ListaInventariere from '../components/ListaInventariere'
var locuri=[];
export default {
    components:{
    'balanta':BalantaAnalitica,
    'lista-inventar':ListaInventariere

  },
  data () {
    return {
       tipurirepere:[{label:'MATERIALE', value:'M'}, {label:'OBIECTE INVENTAR',value:'OB'}, {label:'MIJLOACE FIXE',value:'MF'}],
        tipmaterial:{label:'MATERIALE', value:'M'},
        toatecategoriile:true,
        toatelocurile:true,
        afisezBalanta:false,
        afisezListaInventariere:false,
        toatestarile:true,
        locselectat:null,
        categoriei:null,
        locuriintrare:[],
        datainceput: '2020/04/01',
        datasfirsit:'2020/04/27',
        starimaterial:['NOU', 'FOLOSIT', 'CASARE'],
        staremateriali:'NOU',
      
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
    genLI(){
        this.afisezBalanta=false;
        this.afisezListaInventariere=true;
    },
    genBalanta(){
         const token=this.$store.getters.token;
         let categorii=this.toatecategoriile? '*':this.categoriei.value;
         //tipmaterial
         let locuri=this.toatelocurile? '*':this.locselectat.value;
         let stari=this.toatestarile? '*':this.staremateriali;
         console.log('GENEREZ BALANTA',categorii,this.tipmaterial.value,locuri,stari,this.datainceput,this.datasfirsit);
         var that=this; 
         axios.post(process.env.host+'balante/balantanoua',{
            "tipmaterial":this.tipmaterial.value,
             "datainceput":this.datainceput,
             "datasfirsit":this.datasfirsit,
            "idgestiune":this.$store.getters.gestiuneCurenta.id,
            categorii,
            locuri,
            stari
        },{headers:{"Authorization" : `Bearer ${token}`}}).then(
            res => {
              console.log('A sosit balanta...',res)
              that.afisezBalanta=true;
              that.afisezListaInventariere=false;
            }
        ).catch(err =>{
                  this.$q.notify({
                    color: 'negative',
                    timeout:1500,
                    position:'top',
                    icon: 'delete',
                    message: `EROARE GENERICA! `
                  })
        })

    },
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


