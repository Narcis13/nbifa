<template>

<q-page padding>
    <div class="flex flex-center column ">
    <q-btn v-if="vreauGrid" icon="create" @click="docNou" color="secondary" flat label="Document nou..." class="q-mb-md" />
    <q-table
      v-if="vreauGrid"
      title="Treats"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="name"
    />
    </div>
    <div class="row">
        <div v-if="vreauLista" class="col-3 q-pa-sm" >
             <q-scroll-area style="height: 80vh; ">
                <q-list v-for="d in data" :key="d.name" bordered separator >


                <q-item clickable v-ripple>
                    <q-item-section>
                    <q-item-label overline>{{d.name}}</q-item-label>
                    <q-item-label>{{d.calories}}</q-item-label>
                     <q-item-label>Calciu: {{d.calcium}}</q-item-label>
                    </q-item-section>
                </q-item>
                </q-list>
             </q-scroll-area>
        </div>
        <div v-if="vreauFormular" id="formular" class="col-9 q-pa-sm">
            <div class="row  justify-around items-center">
                <q-select outlined v-model="model" :options="options" label="Tip document" style="min-width:200px;"/>

                <q-input outlined v-model="date" mask="date" :rules="['date']">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-input v-model="text" label="Nr. document" />
            </div>

                    <q-btn  icon="create" @click="clickDocumente" color="secondary" flat label="Documente..." class="q-mb-md" />
        </div>

    </div>

</q-page>
</template>

<script>
export default {
  data () {
    return {
        vreauGrid:true,
        vreauLista:false,
        vreauFormular:false,
        model: null,
        date: '2019/02/01',
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
            pagination: {
                sortBy: 'name',
                descending: false,
                page: 1,
                rowsPerPage: 10
                // rowsNumber: xx if getting data from a server
             },
      columns: [
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
      ],
      data: [
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
    }
  },
  methods:{
      docNou(){
          this.vreauGrid=false;
          this.vreauLista=true;
          this.vreauFormular=true;
      },
      clickDocumente(){
          this.vreauGrid=true;
          this.vreauLista=false;
          this.vreauFormular=false;
      }
  }
}
</script>
<style scoped>
#formular {
    border:2px solid black;
}
</style>