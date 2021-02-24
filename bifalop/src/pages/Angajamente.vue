<template>
<p-page padding>
  <div  class="flex flex-center">
    <q-table
      title="Angajamente"
      :rows="state.angajamente"
      dense
      :columns="columns"
      row-key="id"
      selection="single"
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
              
            <q-btn size="sm" color="accent" round dense @click="(props.expand = !props.expand)&&extinde(props)" :icon="props.expand ? 'remove' : 'add'" >
             
            </q-btn>
             <q-badge  color="red" floating transparent >4</q-badge>
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
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
</p-page>

</template>

<script>
import { defineComponent , reactive,inject,ref} from 'vue'
import AngTimeLine from 'components/AngTimeLine.vue'
import axios from 'axios'
//import AngTimeLine from '../components/AngTimeLine.vue'
const columns = [

  { name: 'nrdoc', align: 'center', label: 'Nr. doc.', field: 'nrdoc', sortable: true },
  { name: 'detalii', align: 'left',label: 'Detalii', field: 'detalii', sortable: true },
 
]

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
           res.data.angajamente[0].map(a=>{
             state.angajamente.push({
               artbug:a.artbug,
               codCap:a.codCap,
               compartiment:a.compartiment,
               dataang:a.dataang,
               detalii:a.detalii,
               idAntet:a.idAntet,
               id:a.id,
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
