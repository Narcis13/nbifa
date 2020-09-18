<template>
<q-page padding>
    <div class="flex flex-center q-pa-md">
        <q-table
        class="my-sticky-virtscroll-table"
        :filter="filter"
        dense
        wrap-cells
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="id"
        separator="cell"
        title="PAAP"
        :data="paap"
        :columns="columns"
        selection="multiple"
        :selected.sync="selected"
        >

        <template v-slot:top>
            <q-btn color="primary"  label="Add row" />
            <q-btn class="q-ml-sm" color="primary"  label="Remove row"  />
            <q-space />
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
        </template>

        </q-table>
  </div>

    <q-page-sticky  position="bottom-right" :offset="[24, 24]">
            <q-btn fab   icon="add" color="accent"   />
    </q-page-sticky>
    <q-page-sticky  position="bottom-left" :offset="[24, 24]">
            <q-btn fab   icon="settings_backup_restore" color="accent"  @click="$router.push('/dashboard')" />
    </q-page-sticky>
</q-page>

</template>


<script>
import { date } from 'quasar'
import axios from 'axios'

export default {
  data () {
    return {
      paap:[],
      selected:[],
      filter:'',
      pagination: {
        rowsPerPage: 0
      },

      columns: [
        {
          name: 'index',
          label: '#',
          field: 'id'
        },
        {
          name: 'articol',
          required: true,
          label: 'Obiectul achizitiei',
          align: 'left',
           style: 'max-width: 300px',
          field: 'obiectachizitie_text',
          format: val => `${val}`,
          sortable: true
        },
        { name: 'codcpv', align: 'center', label: 'Cod CPV', field: 'CodCPV', sortable: true },
        { name: 'cantitate', align:'right',label: 'Cantitate', field: 'cantitate', sortable: true },
        { name: 'valoare', align:'right',label: 'Valoare estimata', field: 'valoare' },
        { name: 'procedura', label: 'Procedura', field: 'procedura',align: 'center', sortable: true ,style: 'max-width: 150px',},
        { name: 'responsabil', label: 'Responsabil', field: 'responsabil',align: 'left' },
        { name: 'compartiment', label: 'Compartiment', align: 'center',field: 'denumire', sortable: true},
        { name: 'artbug', label: 'Art. Bug.', field: 'artbug', sortable: true }
      ]
    }
  },
  created(){
    const token=this.$store.getters.akytoken;
    const rol = this.$store.getters.akyroluserlogat;
    const id_comp = this.$store.getters.idcompartimentakyuserlogat;
    console.log('PAAP created!',rol,id_comp);
    let idc = (rol==="Achizitii")? 0:id_comp;
    axios.get(process.env.host+'paap/paapintegral/'+idc,{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la tot paap-ul',res);
           this.paap = [...res.data.paap];
        }
      ).catch(err =>{})  
  }
}
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 720px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
