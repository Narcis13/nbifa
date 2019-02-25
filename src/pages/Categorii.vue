<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                    title="Categorii repere"
                    :data="categorii"
                    :columns="columns"
                    row-key="id"
                    :filter="filter"
                    selection="single"
                    :selected.sync="selected"
                    :pagination.sync="pagination"
                    rows-per-page-label="Inregistrari pe pagina"

             >
             <template v-slot:top>
                    <q-btn flat dense color="primary"  label="Adauga" @click="addRow" ></q-btn>
                    <q-btn class="on-right" flat dense color="primary"  label="Sterge" @click="removeRow" ></q-btn>
                    <q-space ></q-space>
                    <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Cauta">
                        <template v-slot:append>
                        <q-icon name="search" ></q-icon>
                        </template>
                    </q-input>
           </template>
            </q-table>
        </div>
    </q-page>
</template>



<script>
import axios from 'axios'
export default {
    data(){
        return {
            categorii:[],
            pagination: {
                sortBy: 'name',
                descending: false,
                page: 1,
                rowsPerPage: 12
                // rowsNumber: xx if getting data from a server
             },
            columns: [
                    {
                    name: 'id',
                    required: true,
                    label: 'ID',
                    align: 'left',
                    field: 'id',
                    sortable: true
                    },
                    { name: 'denumire', label: 'Denumire', field: 'denumire', sortable: true,align: 'left' },
                    { name: 'gestiune', label: 'Gestiune', field: 'gestiune', sortable: true ,align: 'left'},
                    { name: 'cont', label: 'Cont', field: 'cont',align: 'left' },
                    { name: 'contcheltuiala', label: 'Cont cheltuiala', field: 'contcheltuiala' ,align: 'left'},
                    { name: 'tipmaterial', label: 'Tip material', field: 'tipmaterial',align: 'left' }

                
                ],
                    filter: '',
                    selected: []
        }
    },
      created(){
     //console.log('Se creeaza Utilizatorii....')
     const token=this.$store.getters.token;

      axios.get(process.env.host+'categ/toate',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate categoriile',res.data.categorii);
           this.categorii=[...res.data.categorii]
        }
      ).catch(err =>{})
  },
  computed: {
    tableClass () {
      if (this.dark) {
        return 'bg-black'
      }
    },
    passHasError(){
        return this.pass.length>0&&this.pass.length<5
      }
  },
  methods:{

  }
}
</script>
