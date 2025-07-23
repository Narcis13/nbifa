<template>
  <q-page padding>
    <div class="flex flex-center">
      <q-table
        class="my-sticky-virtscroll-table"
        :filter="filter"
        dense
        wrap-cells
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="id"
        separator="cell"
        title="PAAP"
        :data="paap"
        :columns="columns"
        selection="multiple"
        binary-state-sort
        ref="paaptableRef"
        v-model:selected="selected"
      >
        <template #top>
          <div class="q-pa-sm text-h4">PAAP</div>
          <div class="q-gutter-sm q-ml-xl">
            <q-radio 
              @update:model-value="schimbaAn" 
              left-label 
              v-model="anselectat" 
              :val="anante" 
              :label="anante" 
            />
            <q-radio 
              @update:model-value="schimbaAn" 
              left-label 
              v-model="anselectat" 
              :val="ancur" 
              :label="ancur" 
            />
            <q-radio 
              @update:model-value="schimbaAn" 
              left-label 
              v-model="anselectat" 
              :val="anpost" 
              :label="anpost" 
            />
          </div>
          
          <q-btn 
            v-show="filtruAplicat" 
            class="q-ml-xl"  
            outline 
            rounded 
            color="primary" 
            label="nefiltrat" 
            @click="handleStergFiltru" 
          />
          
          <q-btn-dropdown 
            v-show="!filtruAplicat" 
            @hide="resetFiltre" 
            icon="filter_list" 
            class="q-ml-xl" 
            outline 
            rounded 
            color="primary"  
            label="Filtreaza" 
          >
            <div class="q-pa-md" style="width:600px;">
              <div class="row q-gutter-md q-mt-xs">
                <div class="col">
                  <q-toggle 
                    v-model="toateArticolele" 
                    color="green" 
                    :label="toateArticolele ? 'Toate articolele bugetare' : 'Numai articolul bugetar'"    
                  />
                </div>
                <div v-show="!toateArticolele" class="col">
                  <paap-artbug @selectie-coloana="alegFiltruArtBug" />
                </div>
              </div>

              <div class="row q-gutter-md q-mt-xs">
                <div class="col">
                  <q-toggle 
                    v-model="toateValorile" 
                    color="green" 
                    :label="toateValorile ? 'Indiferent de valoare' : 'Interval valoare'"    
                  />
                </div>
                <div v-show="!toateValorile" class="col">
                  <q-range 
                    style="max-width:270px;" 
                    v-model="rangeValori" 
                    :min="0"  
                    :max="250000" 
                    :step="1000" 
                    label 
                    color="purple" 
                  />
                </div>
              </div>

              <div class="row q-gutter-md q-mt-xs">
                <div class="col">
                  <q-toggle 
                    v-model="toateProcedurile" 
                    color="green" 
                    :label="toateProcedurile ? 'Toate procedurile' : 'Numai procedura'"    
                  />
                </div>
                <div v-show="!toateProcedurile" class="col">
                  <paap-proceduri @selectie-coloana="alegFiltruProceduri" />
                </div>
              </div> 

              <div v-if="DeLaAchizitii" class="row q-gutter-md q-mt-xs">
                <div class="col">
                  <q-toggle 
                    v-model="toateCompartimentele" 
                    color="green" 
                    :label="toateCompartimentele ? 'Toate compartimentele' : 'Numai compartimentul'"    
                  />
                </div>
                <div v-show="!toateCompartimentele" class="col">
                  <paap-compartimente @selectie-coloana="alegFiltruCompartimente" />
                </div>
              </div>        

              <div class="row q-gutter-md q-mt-xs">
                <div class="flex justify-end col">
                  <q-btn outline color="primary" label="reset" @click="resetFiltre" />
                </div>
                <div class="col">
                  <q-btn outline color="primary" label="Aplica!" @click="handleAplicFiltru" v-close-popup />
                </div>
              </div>   
            </div>
          </q-btn-dropdown>

          <q-btn-dropdown 
            :disable="!eCevaSelectat" 
            icon="description" 
            outline 
            rounded 
            class="q-ml-xl" 
            color="primary"  
            label="Actiuni..."  
          >
            <q-list style="min-width:300px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar icon="create" color="primary" text-color="white" />
                </q-item-section>
                <div class="row">
                  <q-select 
                    style="min-width:250px;margin-right:15px;" 
                    @update:model-value="alegColDeEditat" 
                    filled 
                    v-model="colMultiEdit" 
                    :options="coloaneMultiEdit" 
                    label="Suprascrie valorile din coloana" 
                  />
                  <component 
                    @selectie-coloana="coloanaSelectata" 
                    v-show="amAlesOColoanaDeEditat"  
                    :is="compMultiEdit" 
                  />
                  <q-btn 
                    v-close-popup 
                    v-show="amAlesOColoanaDeEditat && valoareNoua !== null" 
                    @click="handleAplicaModificari" 
                    style="min-width:60px;margin-left:15px;" 
                    round 
                    color="deep-orange" 
                    icon="check_circle"
                  >
                    <q-tooltip content-class="bg-accent">Aplica elementelor selectate</q-tooltip>
                  </q-btn>
                </div>
              </q-item>

              <q-item 
                :disable="ultimulAn" 
                clickable 
                v-close-popup 
                @click="handleCloneazaSelectie"
              >
                <q-item-section avatar>
                  <q-avatar icon="content_copy" color="secondary" text-color="white" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Cloneaza pentru PAAP anul urmator</q-item-label>
                  <q-item-label caption>Elementele selectate</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item clickable v-close-popup @click="confirm = true">
                <q-item-section avatar>
                  <q-avatar icon="cancel_presentation" color="negative" text-color="white" />
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
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body="props">
          <q-tr 
            :style="{backgroundColor: props.row.to > 0 ? '#f4e4ff' : 'white'}" 
            :props="props"
          >
            <q-td auto-width>
              <q-checkbox dense v-model="props.selected" />
            </q-td>
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="articol" :props="props">
              <span>{{ props.row.obiectachizitie_text }}</span> 
              <q-popup-edit 
                @save="editezObiectAky(props.row.id_obiect_achizitie, props.row.obiectachizitie_text)"  
                v-model="props.row.obiectachizitie_text" 
                title="Schimba obiect achizitie" 
                buttons 
                label-set="Modifica" 
                label-cancel="Abandon"
              >
                <q-input 
                  type="textarea" 
                  v-model="props.row.obiectachizitie_text" 
                  dense 
                  autofocus 
                />
              </q-popup-edit>
            </q-td>
            <q-td key="codcpv" :props="props">{{ props.row.CodCPV }}</q-td>
            <q-td key="cantitate" :props="props">
              {{ props.row.cantitate }}
              <q-popup-edit 
                @save="editeaza(props.row.id, 'cantitate', props.row.cantitate)" 
                @hide="proteinRangeValidation" 
                :validate="proteinRangeValidation" 
                v-model="props.row.cantitate" 
                title="Schimba cantitatea" 
                buttons 
                label-set="Modifica" 
                label-cancel="Abandon"
              >
                <q-input  
                  :error="errorProtein"  
                  :error-message="errorMessageProtein" 
                  type="number" 
                  v-model.number="props.row.cantitate" 
                  dense 
                  autofocus 
                />
              </q-popup-edit>
            </q-td>
            <q-td key="valoare" :props="props">
              {{ props.row.valoare }}
              <q-popup-edit 
                @save="editeaza(props.row.id, 'valoare', props.row.valoare)" 
                @hide="proteinRangeValidation" 
                :validate="proteinRangeValidation" 
                v-model="props.row.valoare" 
                title="Schimba valoarea" 
                buttons 
                label-set="Modifica" 
                label-cancel="Abandon"
              >
                <q-input  
                  :error="errorProtein"  
                  :error-message="errorMessageProtein" 
                  type="number" 
                  v-model.number="props.row.valoare" 
                  dense 
                  autofocus 
                />
              </q-popup-edit>
            </q-td>
            <q-td key="procedura" :props="props">{{ props.row.procedura }}</q-td>
            <q-td key="responsabil" :props="props">{{ props.row.responsabil }}</q-td>
            <q-td key="compartiment" :props="props">{{ props.row.denumire }}</q-td>
            <q-td key="artbug" :props="props">{{ props.row.artbug }}</q-td>
          </q-tr>
        </template>

        <template #bottom>
          <div style="min-width: 80vw;" class="row justify-center text-h6">
            {{ nrPozitii }} pozitii - Total valoare: {{ sumaTotala }}
          </div> 
        </template>
      </q-table>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
            <span class="q-ml-sm">Sunteti sigur ca doriti stergerea?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Abandon" color="primary" v-close-popup />
            <q-btn flat label="Sterge" color="primary" @click="handleStergeSelectie" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog 
        v-model="adaug_pozitie" 
        persistent 
        transition-show="scale" 
        transition-hide="scale"
      >
        <paap-pozitie-add 
          :anplan="anselectat" 
          @pozitie-adaugata="handlePozitieAdaugata"
        />
      </q-dialog>
    </div>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn fab icon="add" color="accent" @click="adaug_pozitie = true" />
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[24, 24]">
      <q-btn fab icon="settings_backup_restore" color="accent" @click="$router.push('/dashboard')" />
    </q-page-sticky>
  </q-page>
</template>


<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import PaapProceduri from '../components/paap/PaapProceduri'
import PaapResponsabil from '../components/paap/PaapResponsabil'
import PaapArticolBugetar from '../components/paap/PaapArticolBugetar'
import PaapCodCPV from '../components/paap/PaapCodCPV'
import PozitiePAAPAdd from '../components/PozitiePAAPAdd'
import PaapCompartimente from '../components/paap/PaapCompartimente'

// Composables
import { usePaapData } from '../composables/usePaapData'
import { usePaapFiltering } from '../composables/usePaapFiltering'
import { usePaapEditing } from '../composables/usePaapEditing'
import { usePaapActions } from '../composables/usePaapActions'

const router = useRouter()

// Use composables
const {
  paap,
  selected,
  anselectat,
  ancur,
  anante,
  anpost,
  DeLaAchizitii,
  ultimulAn,
  nrPozitii,
  sumaTotala,
  eCevaSelectat,
  paapCompAn,
  schimbaAn,
  loadInitialData
} = usePaapData()

const {
  filter,
  filtruAplicat,
  rangeValori,
  toateArticolele,
  toateValorile,
  toateProcedurile,
  toateCompartimentele,
  resetFiltre,
  aplicFiltru,
  stergFiltru,
  alegFiltruArtBug,
  alegFiltruProceduri,
  alegFiltruCompartimente
} = usePaapFiltering()

const {
  confirm,
  adaug_pozitie,
  errorProtein,
  errorMessageProtein,
  valoareNoua,
  colMultiEdit,
  compMultiEdit,
  coloaneMultiEdit,
  amAlesOColoanaDeEditat,
  proteinRangeValidation,
  editezObiectAky,
  editeaza,
  coloanaSelectata,
  alegColDeEditat,
  aplicaModificari,
  pozitieAdaugata
} = usePaapEditing()

const {
  stergeSelectie,
  cloneazaSelectie
} = usePaapActions()

// Template refs
const paaptableRef = ref(null)

// Pagination ref
const pagination = ref({
  rowsPerPage: 0
})

// Table columns
const columns = ref([
  {
    name: 'id',
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
  { name: 'cantitate', align: 'right', label: 'Cantitate', field: 'cantitate', sortable: true },
  { name: 'valoare', align: 'right', label: 'Valoare estimata', field: 'valoare', sortable: true },
  { name: 'procedura', label: 'Procedura', field: 'procedura', align: 'center', sortable: true, style: 'max-width: 150px' },
  { name: 'responsabil', label: 'Responsabil', field: 'responsabil', align: 'left' },
  { name: 'compartiment', label: 'Compartiment', align: 'center', field: 'denumire', sortable: true },
  { name: 'artbug', label: 'Art. Bug.', field: 'artbug', sortable: true }
])

// Handler methods that bridge composables
const handleStergFiltru = () => {
  stergFiltru(paapCompAn, anselectat.value)
}

const handleAplicFiltru = () => {
  aplicFiltru(anselectat.value, paap, DeLaAchizitii.value)
}

const handleStergeSelectie = () => {
  stergeSelectie(selected, paap)
}

const handleCloneazaSelectie = () => {
  cloneazaSelectie(selected)
}

const handleAplicaModificari = () => {
  aplicaModificari(selected, paap)
}

const handlePozitieAdaugata = () => {
  pozitieAdaugata(paapCompAn, anselectat.value, paaptableRef)
}

// Lifecycle
onMounted(() => {
  if (DeLaAchizitii.value) {
    coloaneMultiEdit.value.push({ 
      label: 'Compartiment', 
      value: 'denumire', 
      comp: 'paap-compartimente' 
    })
  }
})

onBeforeMount(() => {
  loadInitialData()
})
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
