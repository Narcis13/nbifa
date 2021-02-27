<template>
<p-page padding>
  <div  class="q-mt-sm flex flex-center">
    <q-table
      title="Angajamente"
      :rows="state.angajamente"
      dense
      :columns="columns"
      row-key="id"
      selection="single"
      :pagination="initialPagination"
      v-model:selected="selected"
    >

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
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
        <q-page-sticky  position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent"  />
    </q-page-sticky>
</p-page>

</template>

<script>
import { defineComponent , reactive,inject,ref} from 'vue'
import AngTimeLine from 'components/AngTimeLine.vue'
import axios from 'axios'
import { date } from 'quasar'
//import AngTimeLine from '../components/AngTimeLine.vue'
const columns = [

  { name: 'nrdoc', align: 'center', label: 'Nr. doc.', field: 'nrdoc', sortable: true },
  { name: 'dataang', align: 'center', label: 'Data', field: 'dataang', sortable: true },
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
    angajamente : []        
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
               viza:a.viza==1?true:false,
               nrdoc:a.nrdoc,
               idcompartiment:a.idcompartiment,
               nr:a.nr,
               numecap:a.numecap,
               stare:a.stare,
               suma:a.suma

             })
           })
    
        }
      ).catch(err =>{})


    return {
      initialPagination,
      selected: ref([]),
      columns,
      state,
      sterge(){
        state.rows.pop();
      },
      extinde(props){
        console.log('Ma extinde',props)
      }
    }
  }
})
</script>
