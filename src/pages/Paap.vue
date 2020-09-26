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
            <div class="q-pa-sm text-h4">PAAP</div>
            <div class="q-gutter-sm q-ml-xl">
                <q-radio @input="schimbaAn" left-label v-model="anselectat" :val="anante" :label="anante" />
                <q-radio @input="schimbaAn" left-label v-model="anselectat" :val="ancur" :label="ancur" />
                <q-radio @input="schimbaAn" left-label v-model="anselectat" :val="anpost" :label="anpost" />
     
            </div>
            <q-btn-dropdown icon="filter_list" class="q-ml-xl" outline rounded color="primary"  label="Filtreaza" >
              <div class="q-pa-md" style="width:300px;">Filtre si alte balarii ....</div>
            </q-btn-dropdown>

            <q-btn-dropdown :disable="!eCevaSelectat" icon="description" outline rounded class="q-ml-xl" color="primary"  label="Actiuni..."  >
                <q-list style="min-width:300px">
                        <q-item   >
                          <q-item-section avatar>
                            <q-avatar icon="create" color="primary" text-color="white"></q-avatar>
                          </q-item-section>
                         
                            <div class="row">
                              <q-select style="min-width:250px;margin-right:15px;" filled v-model="colMultiEdit" :options="coloaneMultiEdit" label="Suprascrie valorile din coloana" />
                              <q-input  label="Standard" />
                              <q-btn style="min-width:60px;margin-left:15px;" round color="deep-orange" icon="check_circle">
                                 <q-tooltip content-class="bg-accent">Aplica elementelor selectate</q-tooltip>
                              </q-btn>
                            </div>
                         

                        </q-item>

                        <q-item clickable v-close-popup @click="cloneazaSelectie">
                          <q-item-section avatar>
                            <q-avatar icon="content_copy" color="secondary" text-color="white"></q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Cloneaza pentru PAAP anul urmator</q-item-label>
                            <q-item-label caption>Elementele selectate</q-item-label>
                          </q-item-section>

                        </q-item>
                        
                      <q-item clickable v-close-popup @click="stergeSelectie">
                          <q-item-section avatar>
                            <q-avatar icon="cancel_presentation" color="negative" text-color="white"></q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Sterge</q-item-label>
                            <q-item-label caption>Elementele selectate</q-item-label>
                          </q-item-section>

                        </q-item>
                      </q-list>
            </q-btn-dropdown>

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
      anselectat:(new Date()).getFullYear().toString(),
      ancur:(new Date()).getFullYear().toString(),
      anante:((new Date()).getFullYear()-1).toString(),
      anpost:((new Date()).getFullYear()+1).toString(),
      pagination: {
        rowsPerPage: 0
      },
      colMultiEdit:null,
      coloaneMultiEdit:[
        {label:'Cod CPV',value:'CodCPV'},
        { label: 'Procedura', value: 'procedura'},
        { label: 'Responsabil', value: 'responsabil' },
        { label: 'Articol Bugetar', value: 'artbug'}
      ],
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
  computed:{
    eCevaSelectat(){
      return this.selected.length>0
    }
  },
  methods: {
      schimbaAn(value){
        console.log('Noul an ',value)
          this.paapCompAn(value)
      },
      stergeSelectie(){

      },
      cloneazaSelectie(){

      },
      paapCompAn(an){
          const token=this.$store.getters.akytoken;
          const rol = this.$store.getters.akyroluserlogat;
          const id_comp = this.$store.getters.idcompartimentakyuserlogat;
        // console.log('PAAP created!',rol,id_comp);
          let idc = (rol==="Achizitii")? 0:id_comp;
          axios.get(process.env.host+'paap/paapintegral/'+idc+'/'+an,{headers:{"Authorization" : `Bearer ${token}`}}).then(

              res => {
                console.log('Rspuns la tot paap-ul',res);
                this.paap = [...res.data.paap];
              }
            ).catch(err =>{})  
            }
  },
  created(){
      this.paapCompAn(this.ancur)
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
