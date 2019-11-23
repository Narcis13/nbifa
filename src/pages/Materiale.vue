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
                    @schimbagestiunea="alert('schimb gestiunea')"
        >
           <template v-slot:top>

                    <q-btn class="on-right"  outline rounded  color="primary"  label="Sterge" @click="deleteRow" ></q-btn>
                    <q-space ></q-space>
                    <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Cauta">
                        <template v-slot:append>
                        <q-icon name="search" ></q-icon>
                        </template>
                    </q-input>
           </template>

                 <template v-slot:body="props">
                      <q-tr :props="props">
                       <q-td auto-width>
                          <q-checkbox  v-model="props.selected" ></q-checkbox>
                        </q-td>
                        <q-td key="id" :props="props">{{ props.row.id }}</q-td>
                        <q-td key="denumire" :props="props">
                          {{ props.row.denumire }}
                                <q-popup-edit buttons v-model="props.row.denumire" @save="editeaza(props.row.id,'denumire',props.row.denumire)">
                                  <q-input v-model="props.row.denumire" dense autofocus  ></q-input>
                                </q-popup-edit>
                        </q-td>
                        <q-td key="um" :props="props">
                          {{ props.row.um }}
                               <q-popup-edit buttons v-model="props.row.um" @save="editeaza(props.row.id,'um',props.row.um)">
                                     <q-input v-model="props.row.um" dense autofocus  ></q-input>
                                </q-popup-edit>
                         </q-td>
                         <q-td key="pretpredefinit" :props="props">
                          {{ props.row.pretpredefinit }}
                               <q-popup-edit buttons v-model="props.row.pretpredefinit" @save="editeaza(props.row.id,'pretpredefinit',props.row.pretpredefinit)">
                                     <q-input v-model="props.row.pretpredefinit" dense autofocus  ></q-input>
                                </q-popup-edit>
                         </q-td>

                        <q-td key="gestiune" :props="props">
                          {{ props.row.gestiune }}

                         </q-td>
                        <q-td key="user" :props="props">
                          {{ props.row.user }}

                        </q-td>
                        <q-td key="datacreere" :props="props">
                          {{ props.row.datacreere }}

                         </q-td>
                        <q-td key="datamodificare" :props="props">
                          {{ props.row.datamodificare }}

                        </q-td>

                      </q-tr>
                  </template>

                  <template v-slot:body-cell="props">
                     <q-td :props="props">
                        <div v-bind:style="{color:props.row.eNou? 'blue':'black'}">
                             {{props.value}}
                        </div>

                    </q-td>
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

        axios.get(process.env.host+`materiale/toate/${this.$store.getters.gestiuneCurenta.id}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

          res => {
             console.log('Rspuns la toate materialele',res.data);
             this.materiale=[...res.data.materiale]
          }
        ).catch(err =>{})
    },
    methods:{
            editeaza(id,cheie,valoarenoua){

              console.log('editez',id,cheie,valoarenoua)
              const token=this.$store.getters.token;
               var that = this;
              axios.put(process.env.host+`materiale/${id}`,{[cheie]:valoarenoua}
                 ,{headers:{"Authorization" : `Bearer ${token}`}}).then(
                      res => {

                            // aici merge sa actualizez si in grid data modificarii
                            that.materiale.map((item,index)=>{
                              if (item.id==id){
                                that.materiale[index].datamodificare=(new Date()).toLocaleDateString('ro-RO');
                              }
                            })
                })
                
        },
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