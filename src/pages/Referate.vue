<template>
<q-page padding>
     <div class="row justify-center q-mt-md">
     
         <q-table
                title="Referate necesitate"
                :data="rows"
                :columns="columns"
                row-key="name"
                :pagination.sync="pagination"
                hide-pagination
        >
        </q-table>
     </div>

        <div class="row justify-center q-mt-md">
            <q-pagination
                v-model="pagination.page"
                color="grey-8"
                :max="pagesNumber"
                size="sm"
            />
        </div>

    <q-dialog v-model="adaug_referat" persistent transition-show="scale" transition-hide="scale">
        <ref-necesitate-add />
    </q-dialog>


    <q-page-sticky  position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent"  @click="adaug_referat=true" />
    </q-page-sticky>
    <q-page-sticky  position="bottom-left" :offset="[24, 24]">
            <q-btn fab   icon="settings_backup_restore" color="accent"  @click="$router.push('/dashboard')" />
    </q-page-sticky>
</q-page>
</template>


<script>
import ReferatNecesitateAdd from '../components/ReferatNecesitateAdd'
export default {
    components:{
        'ref-necesitate-add':ReferatNecesitateAdd
    },
    data(){
        return {
            adaug_referat:false,
            pagination: {

                page: 1,
                rowsPerPage: 4
                // rowsNumber: xx if getting data from a server
            },

            columns: [
                {
                name: 'desc',
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
                { name: 'protein', label: 'Protein (g)', field: 'protein' }
            ],

            rows: [
                {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0
                },
                {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
                carbs: 37,
                protein: 4.3
                },
                {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
                carbs: 23,
                protein: 6.0
                },
                {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3
                },
                {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
                carbs: 49,
                protein: 3.9
                },
                {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
                carbs: 94,
                protein: 0.0
                },
                {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
                carbs: 98,
                protein: 0
                },
                {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
                carbs: 87,
                protein: 6.5
                },
                {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
                carbs: 51,
                protein: 4.9
                },
                {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
                carbs: 65,
                protein: 7
                }
            ]
        }
    },
    computed: {
        pagesNumber () {
            return Math.ceil(this.rows.length / this.pagination.rowsPerPage)
        }
  }
}
</script>