<template>
<q-card style="width: 800px; max-width: 70vw;">
        <q-bar>
          <q-btn dense flat  :icon="panelActiv=='unul'?'list':'arrow_back'" @click="schimbaPanelActiv">
            <q-tooltip>{{panelActiv=='unul'?'Toate angajamentele legale':'Inapoi'}}</q-tooltip>
          </q-btn>
          <div>Angajamente legale</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
      <q-tab-panels v-model="panelActiv" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="unul">
          <div class="text-subtitle1">Ang. bugetar nr. {{angBugetar.nrdoc}} din {{angBugetar.dataang}} - {{angBugetar.detalii}}</div>
          <div class="text-subtitle2"> Categoria: {{angBugetar.categorie}} Art. bug. {{angBugetar.artbug}} <span class="text-right">Suma disponibila: {{angBugetar.suma}}</span></div>
           <div class="q-pa-sm q-gutter-md row">
              <q-select
                label="Furnizor"
                v-model="furnizor"
                use-input
                :options="furnizori"
                @filter="filterFn"
                hint="Min 2 caractere pentru a cauta..."
                style="width: 200px; padding-bottom: 16px"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">

                    <q-item-section>
                      <q-item-label v-html="scope.opt.label" />
                      <q-item-label caption>CUI: {{ scope.opt.cui }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>

              </q-select>

              <q-input  v-model="nrcontract" label="Nr. contract" stack-label  />

              <q-input style="width: 140px; padding-bottom: 16px" label="Data contract" stack-label v-model="deladata" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="deladata">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Inchide" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

             <q-input v-model.number="valoare" type="number" label="Valoare" stack-label  />

          </div>
         <div class="row items-center justify-center">
                        <q-btn @click="angLegalNou" label="Adauga" color="primary" flat />
         </div>
        </q-tab-panel>

        <q-tab-panel name="toate">
            <div class="q-pa-md">
              <q-table
               
                dense
                :filter="filter"
                :pagination="initialPagination"
                :rows="rows"
                v-model:selected="selected"
                :columns="columns"
                row-key="name"
                selection="single"
              >

                  <template v-slot:top>

                      <div class="flex" style="min-width:200px;max-height:100px;">
  
                          <q-btn  class="q-ma-sm"  round color="red" icon="delete_forever" >
                              <q-tooltip class="bg-accent">Sterge</q-tooltip>
                          </q-btn>

                      </div>

                

                    <q-space />
                    <q-input outlined dense debounce="300" color="primary" v-model="filter">
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                </template>
              </q-table>
            </div>
        </q-tab-panel>

      </q-tab-panels>

 
                       
</q-card>
</template>

<script>
import { defineComponent,ref,computed,inject } from 'vue'
import { date } from 'quasar'
import axios from 'axios'
import { useQuasar } from 'quasar'

const  initialPagination = {
       // sortBy: 'desc',
       // descending: false,
        page: 1,
        rowsPerPage: 10

      }

const columns = [
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

const rows = [
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


let totiFurnizorii = [

]

export default defineComponent({
    name:'AngajamentLegal',
    props:['ang_bugetar'],
    setup (props, { emit }) {
        const global=inject('global');
        const token=global.state.user.token;
        const compartiment=global.state.user.compartiment;
        let idcompartiment=compartiment=='SUPERVIZARE'? 0:global.state.user.nume_logare;

        let azi=new Date()
        let deladata=ref(date.formatDate(azi, 'YYYY/MM/DD'))
        /**
         * 
        incarc furnizorii

         */

        axios.get(process.env.host+`furnizori/toti/${idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

                    res => {
                    console.log('Raspuns la toti furnizorii',res.data);
                    totiFurnizorii=[];
                    res.data.furnizori.map(f=>{
                       totiFurnizorii.push({label:f.denumire,value:f.id,cui:f.codfiscal})
                    })
                
                    }
                ).catch(err =>{})

       console.log('Prop ang legal',props.ang_bugetar)
       let furnizori=ref([])
       let furnizor = ref(null)
       let nrcontract=ref("")
       let valoare=ref(0)
       let panelActiv = ref('unul')
        return {
            panelActiv,
            furnizori,
            furnizor,
            nrcontract,
            valoare,
            deladata,
            columns,
            rows,
            selected: ref([]),
            filter:ref(''),
            initialPagination,
            angBugetar:props.ang_bugetar,
            filterFn (val, update, abort) {
                if (val.length < 2) {
                  abort()
                  return
                }

                update(() => {
                  const needle = val.toLowerCase()
                  console.log('toti furnizorii',totiFurnizorii)
                  furnizori.value = totiFurnizorii.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
                })
          },
            schimbaPanelActiv(){
               if(panelActiv.value=='unul')
                  panelActiv.value='toate'
               else
                  panelActiv.value='unul'

            },
            angLegalNou(){
              console.log('Angajament legal nou!',props.ang_bugetar,deladata.value)
                   let anglegal={idAng:props.ang_bugetar.idAntet,numepartener:furnizor.value.label,furnizor:furnizor.value.value,nrcontract:nrcontract.value,valoare:valoare.value,datacontract:deladata.value,addedby:global.state.user.nume_logare};
                   axios.post(process.env.host+'furnizori/anglegalnou',anglegal,{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{

                      //  console.log('A sosit rasunsul de la furnizor nou...')
                        emit('anglegal-adaugat',{id:res.data.id})

                    })
                    .catch(err=>{
                                    
                    })
            }
        }
    }
})
</script>

<style scoped>

</style>