<template>
<q-page padding>
  <div  class="q-mt-sm flex flex-center">
    <q-table
      title="Furnizori"
      :filter="filter"
      :rows="state.furnizori"
      dense
      :columns="columns"
      row-key="id"
      :pagination="initialPagination"
      selection="single"
      v-model:selected="selected"

    >

            <template v-slot:top>
            <div class="q-pa-sm text-h6">Furnizori</div>
            <div class="row q-gutter-sm q-pa-sm q-ml-xl">
              
               <div class="flex" style="min-width:200px;max-height:100px;">

                   <q-btn  class="q-ma-sm"  round color="red" :disable="selected.length==0" icon="delete_forever" >
                      <q-tooltip class="bg-accent">Sterge</q-tooltip>
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


    </q-table>
  </div>

    <q-page-sticky  position="bottom-right" :offset="[24, 24]">
            <q-btn  fab   icon="add" color="accent"  >
              <q-tooltip anchor="top start" self="center right" class="bg-accent">Adauga Furnizor</q-tooltip>
            </q-btn>
    </q-page-sticky>

</q-page>
</template>

<script >
import { defineComponent ,reactive,inject,ref,computed} from 'vue'
import axios from 'axios'
import { date } from 'quasar'
import { useQuasar } from 'quasar'

const columns = [

  { name: 'denumire', align: 'left', label: 'Furnizor', field: 'denumire', sortable: true },
  { name: 'codfiscal', align: 'left', label: 'Cod fiscal', field: 'codfiscal', sortable: true },
  { name: 'iban', align: 'left',label: 'Cont IBAN', field: 'iban', sortable: false },
  { name: 'adresa', align: 'left',label: 'Adresa', field: 'adresa', sortable: false },
  { name: 'localitate', align: 'left',label: 'Localitate', field: 'localitate', sortable: true },
  { name: 'judet', align: 'left',label: 'Judet', field: 'judet', sortable: true },
  /*{ name: 'artbug', align: 'center',label: 'Art. bug.', field: 'artbug', sortable: true },
  { name: 'viza', align: 'center',label: 'Viza CFPP', field: 'viza', sortable: true }*/
 
]

const  initialPagination = {
       // sortBy: 'desc',
       // descending: false,
        page: 1,
        rowsPerPage: 15

      }
const state = reactive(
  {
    furnizori : []  
  }
  )
export default defineComponent({
    setup () {
            const $q = useQuasar()
   
    const global=inject('global');
    const token=global.state.user.token;
    const compartiment=global.state.user.compartiment;
    let idcompartiment=compartiment=='SUPERVIZARE'? 0:global.state.user.nume_logare;
     console.log('Setup Furnizori',idcompartiment)

        function totiFurnizorii(){
                axios.get(process.env.host+`furnizori/toti/${idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

                    res => {
                    console.log('Raspuns la toate angajamentele',res.data);
                    state.furnizori=[];
                    res.data.furnizori.map(f=>{
                        state.furnizori.push(f)
                    })
                
                    }
                ).catch(err =>{})
        }

        totiFurnizorii();


        let selected= ref([])


        return {
            state,
            initialPagination,
            columns,
            selected,
            filter:ref(''),
            }
    }
})
</script>

<style scoped>

</style>