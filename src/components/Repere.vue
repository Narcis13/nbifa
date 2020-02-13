<template>
   <div>

        <div class="row " style="min-width:600px;">
              <q-table
                  dense
                  separator="cell"
                  :data="repere"
                  :columns="columns"
                  selection="multiple"
                    :pagination.sync="pagination"
                  :selected.sync="selected"
                  no-data-label="Niciun reper!"
                  row-key="name"

                >
                      <template v-slot:top>
                          
                          <q-btn class="on-right" flat dense color="primary" :disable="loading" label="Sterge" @click="removeRow" />
                          <q-space />
                          <q-input  dense debounce="300" color="primary" v-model="filter">
                            <template v-slot:append>
                              <q-icon name="search" />
                            </template>
                          </q-input>
                      </template>
                      <template v-slot:bottom-row>
                        <q-tr>
                          <q-td style="text-align: right;" colspan="100%">
                            Total {{valoaretotala}} lei
                          </q-td>
                        </q-tr>
                     </template>
              </q-table>        
        </div>
         
   </div>
    
</template>
<script>
export default {
     name:'Repere',
     props:['repere'],
     data () {
        return {
          listarepere:this.repere,
            selected: [],
        pagination: {

                page: 1,
                rowsPerPage: 10
                // rowsNumber: xx if getting data from a server
             },
          columns: [
            { name: 'categ', label: 'Categoria', field: 'categ',align: 'left',style: 'width: 180px', },
            {
              name: 'denumire_reper',
              required: true,
               style: 'width: 220px',
              label: 'Denumire reper',
              align: 'left',
              field: 'denumire_reper',
              format: val => `${val}`,
              sortable: true
            },
            { name: 'um', align: 'center', label: 'U/M', field: 'um', sortable: true },
           // { name: 'stare', align: 'center', label: 'Stare', field: 'stare', sortable: true },
            { name: 'cantitate', label: 'Cantitate', field: 'cantitate', sortable: true ,align: 'right'},
            { name: 'pret', label: 'Pret', field: 'pret',align: 'right',style: 'width: 100px', },
            { name: 'valoare', label: 'Valoare', field: 'valoare',align: 'right',style: 'width: 125px', }
            
          ],
          data: [
            {
              name: 'Frozen Yogurt',
              calories: 159,
              fat: 6.0,
              carbs: 24,
              stare:'Folosit',
              protein: 4.0,
              sodium: 87,
              calcium: '14%',
              iron: '1%'
            },
            {
              name: 'Ice cream sandwich ',
              calories: 237,
              fat: 9.0,
              carbs: 37,
              stare:'Nou',
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
              stare:'Nou',
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
              stare:'Nou',
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
              stare:'Nou',
              sodium: 327,
              calcium: '7%',
              iron: '16%'
            },
            {
              name: 'Jelly bean',
              calories: 375,
              fat: 0.0,
              stare:'Nou',
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
              stare:'Nou',
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
              stare:'Nou',
              calcium: '0%',
              iron: '45%'
            },
            {
              name: 'Donut',
              calories: 452,
              fat: 25.0,
              carbs: 51,
              protein: 4.9,
              stare:'Nou',
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
              stare:'Nou',
              sodium: 54,
              calcium: '12%',
              iron: '6%'
            }
          ]
        }
  } ,
  computed:{

        valoaretotala(){
          let total=0;
          this.repere.map(reper=>{
            total+=parseFloat(reper.valoare)
          })
          return total.toFixed(2);
        }
  }         
}
</script>
