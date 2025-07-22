<template>
  <q-card style="width: 1200px; height:800px;max-width: 80vw;max-height: 80vh;">
    <div class="column">
      <div class="row q-mt-md" style="height:90%;">
        
        <!-- Left Column - PAAP Table -->
        <div class="col-5 q-pa-sm">
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
            :rows="paap"
            :columns="coloane_paap"
            selection="single"
            @selection="pozPAAPSelectat"
            binary-state-sort
            ref="paaptable"
            v-model:selected="selected"
          >
            <template v-slot:top>
              <div class="text-h6">PAAP</div>
              <q-space />
              <q-input 
                borderless 
                dense 
                debounce="300" 
                color="primary" 
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
          </q-table>
        </div>

        <!-- Right Column - Form -->
        <div id="drrr" class="col-7 q-pa-sm coloana-dreapta">
          
          <!-- Date and Object -->
          <div class="row">
            <q-input 
              class="q-mt-md" 
              stack-label 
              label="Data achizitie" 
              dense 
              filled 
              v-model="data_referat" 
              mask="date" 
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy 
                    ref="qDateProxy" 
                    transition-show="scale" 
                    transition-hide="scale"
                  >
                    <q-date v-model="data_referat">
                      <div class="row items-center justify-end">
                        <q-btn 
                          v-close-popup 
                          label="Inchide" 
                          color="primary" 
                          flat 
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input 
              class="q-ml-xl" 
              style="width:300px;" 
              dense 
              stack-label 
              filled 
              v-model="obiect_achizitie" 
              label="Obiect achizitie" 
            />
          </div>

          <!-- Justification -->
          <div class="q-mt-xs q-mb-xs q-pa-xs">
            <q-input
              v-model="justificare"
              label="Justificarea necesitatii"
              filled
              style="height:70px"
              type="textarea"
            />
          </div>

          <q-separator inset />

          <!-- Product Details -->
          <div class="row">
            <div style="height:100px" class="drop col-6 shadow-1 q-pa-sm q-mt-md">
              <div><span class="text-bold">Denumire reper: </span> {{ linieRN.denumire }}</div>
              <div><span class="text-bold">Cod CPV: </span> {{ linieRN.codcpv }}</div>
            </div>
            <div class="col-6 q-pa-sm q-mt-sm">
              <q-input
                v-model="linieRN.detalii_tehnice"
                label="Detalii tehnice"
                filled
                style="height:100px"
                type="textarea"
              />
            </div>
          </div>

          <!-- Quantity, Price, Value -->
          <div class="row q-mt-sm justify-between">
            <q-input 
              v-model.number="linieRN.cantitate" 
              type="number" 
              filled 
              dense 
              label="Cantitate" 
              error-message="Cantitate invalida!" 
              :error="!cantitateValida"
            />
            <q-input 
              v-model.number="linieRN.pret" 
              type="number" 
              filled 
              dense 
              label="Pret" 
              error-message="N/A!" 
              :error="false"
            />
            <q-input 
              class="q-mr-sm" 
              readonly 
              v-model.number="valoareLinieRN" 
              type="number" 
              filled 
              dense 
              label="Valoare" 
              error-message="N/A!" 
              :error="false"
            />
          </div>

          <div class="row justify-center q-mt-sm q-mb-md">
            <q-btn 
              :disable="!informatiiComplete" 
              @click="adaugLinieRN" 
              flat 
              label="Adauga!" 
            />
          </div>

          <q-separator inset />

          <!-- Products Table -->
          <div class="q-pa-xs q-mt-sm">
            <q-table
              :id="uuid"
              dense
              :rows="liniiRN"
              v-model:pagination="pagination_repere"
              wrap-cells
              separator="cell"
              :columns="columns"
              selection="single"
              v-model:selected="repere_selectate"
              no-data-label="Niciun reper!"
              row-key="idpozPAAP"
            >
              <template v-slot:top>
                <q-btn 
                  v-show="repere_selectate.length==1" 
                  class="on-right" 
                  icon="delete_sweep" 
                  flat 
                  dense 
                  color="primary" 
                  label="Sterge" 
                  @click="removeRow" 
                />
              </template>
              
              <template v-slot:bottom-row>
                <q-tr>
                  <q-td style="text-align: right;" colspan="100%">
                    Total {{ valoaretotala }} lei
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="row justify-center">
        <q-btn flat label="Abandon" v-close-popup />
        <q-btn 
          @click="salveaza" 
          flat 
          label="Salveaza!" 
          :disable="!documentValid" 
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { usePaapData } from '../composables/usePaapData'
import { useReferatForm } from '../composables/useReferatForm'
import { useReferatApi } from '../composables/useReferatApi'

const props = defineProps({
  mod: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['referat-nou'])

// Template refs
const qDateProxy = ref(null)
const paaptable = ref(null)

// Use composables
const {
  paap,
  selected,
  filter,
  coloane_paap,
  pagination
} = usePaapData()

const {
  data_referat,
  uuid,
  obiect_achizitie,
  justificare,
  cantitate_maxima,
  linieRN,
  liniiRN,
  repere_selectate,
  pagination_repere,
  columns,
  valoareLinieRN,
  cantitateValida,
  informatiiComplete,
  documentValid,
  valoaretotala,
  pozPAAPSelectat,
  adaugLinieRN,
  resetLinieRN,
  removeRow
} = useReferatForm()

const { salveazaReferat } = useReferatApi()

// Methods
const salveaza = async () => {
  const result = await salveazaReferat({
    data_referat: data_referat.value,
    obiect_achizitie: obiect_achizitie.value,
    valoaretotala: valoaretotala.value,
    justificare: justificare.value,
    liniiRN: liniiRN.value
  })
  
  if (result.success) {
    // Clean up after saving
    liniiRN.value = []
    obiect_achizitie.value = ""
    selected.value = []
    
    emit("referat-nou", { nimic: 'interesant' })
  }
}

console.log('Componentul ReferatNecesitateAdd a fost creat!', props)
</script>

<style lang="sass" scoped>
.coloana-dreapta 
  border-left: 1px solid grey

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