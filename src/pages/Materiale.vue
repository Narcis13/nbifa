<template>
    <q-page padding>
        <div class="q-gutter-md column items-start">
        <material-add :data="materiale"/>
         <q-separator inset />
        <q-table
            title="Lista Materiale"
                    :data="materiale"
                    separator="cell"
                    :columns="columns"
                    row-key="id"
                    :filter="filter"
                    selection="single"
                    :selected.sync="selected"
                    :pagination.sync="pagination"
                    rows-per-page-label="Inregistrari pe pagina"
        >
        <template v-slot:body-cell="props">
          <q-td :props="props">
              <div v-bind:style="{color:props.row.eNou? 'blue':'black'}">
                {{props.value}}
              </div>

          </q-td>
        </template>
                <template slot="top-selection" slot-scope="props">
        
        
                    <div class="col" />
                    <q-btn color="negative" flat round icon="delete" @click="deleteRow" />
                </template>
        </q-table>
        </div>
    </q-page>    
</template>

<script>
import axios from 'axios'
import MaterialAdd from '../components/MaterialAdd'
export default {
    components:{
        'material-add':MaterialAdd
    },
    data(){
        return {
            columns: [
               { name: 'id', align: 'center', label: 'id', field: 'id', sortable: true },
        {
          name: 'denumire',
          required: true,
          label: 'Denumire',
          align: 'left',
          field: 'denumire',
          format: val => `${val}`,
          sortable: true
        },
        { name: 'um', align: 'center', label: 'U / M', field: 'um', sortable: true },
        { name: 'pretpredefinit', label: 'Pret predefinit', field: 'pretpredefinit', sortable: true ,align: 'right'},
        { name: 'gestiune', label: 'Gestiune', field: 'gestiune' ,align: 'left'},
        { name: 'user', label: 'Utilizator', field: 'user' ,align: 'left'},
        { name: 'datacreere', label: 'Data creere', field: 'datacreere' ,align: 'left'},
        { name: 'datamodificare', label: 'Data modificare', field: 'datamodificare', sortable: true,align: 'left' }
        
      ],
        materiale: [
      ],
      filter: '',
      selected: [],
      pagination: {
                sortBy: 'id',
                descending: true,
                page: 1,
                rowsPerPage: 12
                // rowsNumber: xx if getting data from a server
             }
        }
    },
    created(){
           console.log('Gestiune curenta',this.$store.getters.gestiuneCurenta,'id user logat',this.$store.getters.userid)
           const token=this.$store.getters.token;

        axios.get(process.env.host+'materiale/toate',{headers:{"Authorization" : `Bearer ${token}`}}).then(

          res => {
             console.log('Rspuns la toate materialele',res.data);
             this.materiale=[...res.data.materiale]
          }
        ).catch(err =>{})
    },
    methods:{
      deleteRow(){
        console.log('Sterg material',this.selected)
        var that=this;
       const token=this.$store.getters.token;
       let id= this.selected[0].id;
                axios.patch(process.env.host+`materiale/sterg/${id}`,{},{headers:{"Authorization" : `Bearer ${token}`}}).then(
                res => {
                         this.$q.notify({
                          message:`Materialul selectat ${that.selected[0].denumire} a fost invalidat!`,
                          timeout:1500,
                          position:'top',
                          color:'positive'
                          })
                                     that.materiale.some(function(item, index) {
                                            return ( that.materiale[index]["id"] === id) ? !!( that.materiale.splice(index, 1)) : false;
                                           });   
                   })
      }
    }
}
</script>