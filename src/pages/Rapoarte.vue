<template>
  <q-page padding>
    <div class="flex flex-center column">
      <div class="row q-pa-md">
        <q-select  
          @update:model-value="schimbTipMaterial" 
          outlined 
          v-model="tipmaterial" 
          :options="tipurirepere" 
          label="Tip material" 
        /> 
        <div class="column q-pa-md">
          <q-toggle v-model="toatecategoriile" color="green" label="Toate categoriile" />
          <q-select
            outlined
            v-if="!toatecategoriile"
            v-model="categoriei"
            dense
            label="Categorie reper"
            :options="categorii"
            style="width: 175px;"
          />
        </div>

        <div class="column q-pa-md">
          <q-toggle v-model="toatelocurile" color="green" label="Toate locurile" />
          <q-select
            filled
            v-if="!toatelocurile"
            dense
            v-model="locselectat"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="Loc dispunere"
            :options="locuriintrare"
            @filter="filterIFn"
            style="width: 175px;"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Niciun rezultat
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="column q-pa-md">
          <q-toggle v-model="toatestarile" color="green" label="Toate starile" />
          <q-select 
            v-if="!toatestarile" 
            dense 
            outlined 
            v-model="staremateriali" 
            :options="starimaterial" 
            label="Stare material" 
            style="width:175px;"
          />
        </div>      
        
        <div class="column q-pa-md">
          <q-btn-dropdown rounded color="secondary" label="Perioada">
            <q-card>
              <q-card-section>
                <q-input 
                  filled 
                  label="De la" 
                  v-model="datainceput" 
                  mask="date" 
                  :rules="['date']"
                >
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy 
                        ref="qDateProxy1" 
                        transition-show="scale" 
                        transition-hide="scale"
                      >
                        <q-date 
                          v-model="datainceput" 
                          @update:model-value="() => qDateProxy1?.hide()" 
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input 
                  filled 
                  label="La" 
                  v-model="datasfirsit" 
                  mask="date" 
                  :rules="['date']"
                >
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy 
                        ref="qDateProxy2" 
                        transition-show="scale" 
                        transition-hide="scale"
                      >
                        <q-date 
                          v-model="datasfirsit" 
                          @update:model-value="() => qDateProxy2?.hide()" 
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>

              <q-card-actions vertical>
                <q-btn flat v-close-popup>Selecteaza</q-btn>
              </q-card-actions>
            </q-card>
          </q-btn-dropdown>
          <div class="q-pa-sm text-bold">
            {{ datainceput }} : {{ datasfirsit }}
          </div>
        </div>  
      </div> 
      
      <div class="q-pa-md flex flex-center column">
        <q-btn-group rounded>
          <q-btn 
            @click="genBalanta" 
            color="amber" 
            rounded 
            glossy 
            icon-right="update" 
            label="BALANTA ANALITICA DE GESTIUNE" 
          />
          <q-btn 
            @click="genLI" 
            color="amber" 
            rounded 
            glossy 
            icon-right="update" 
            label="LISTA DE INVENTARIERE" 
          />
          <q-btn-dropdown glossy rounded color="amber" label="Fisa de cont">
            <q-card>
              <q-card-section>
                <div class="q-gutter-md row">
                  <q-select
                    filled
                    v-model="materialselectat"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="materialelegestiunii"
                    @filter="filterFn"
                    hint="Mininum 2 caractere pentru cautare..."
                    style="width: 250px; padding-bottom: 32px"
                  >
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Niciun material gasit!
                        </q-item-section>
                      </q-item>
                    </template>
                    <template #option="scope">
                      <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }} ({{ scope.opt.um }})</q-item-label>
                          <q-item-label>Cod: {{ scope.opt.cod }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </q-card-section>
              <q-card-actions vertical>
                <q-btn flat v-close-popup @click="genFisaCont">Genereaza !</q-btn>
              </q-card-actions>
            </q-card>
          </q-btn-dropdown>
        </q-btn-group>
      </div>
       
      <lista-inventar v-if="afisezListaInventariere" />
      <balanta 
        v-if="afisezBalanta" 
        :setdate="datebalanta" 
        :total="totalstocfinal" 
        :parametrii="parametrii_balanta"
      />
      <fisa-cont 
        v-if="afisezFisaCont" 
        :setdate="datefisacont" 
        :parametrii="parametrii_fisa"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { date } from 'quasar'
import axios from 'axios'
import BalantaAnalitica from '../components/Balanta'
import ListaInventariere from '../components/ListaInventariere'
import FisaCont from '../components/FisaCont'

const $q = useQuasar()
const store = useStore()

const tipurirepere = [
  { label: 'MATERIALE', value: 'M' }, 
  { label: 'OBIECTE INVENTAR', value: 'OB' }, 
  { label: 'MIJLOACE FIXE', value: 'MF' }
]

const tipmaterial = ref({ label: 'MATERIALE', value: 'M' })
const toatecategoriile = ref(true)
const toatelocurile = ref(true)
const afisezBalanta = ref(false)
const afisezFisaCont = ref(false)
const afisezListaInventariere = ref(false)
const toatestarile = ref(true)
const locselectat = ref(null)
const categoriei = ref(null)
const categorii = ref([])
const locuriintrare = ref([])
const materialelegestiunii = ref([])
const materialselectat = ref(null)
const datainceput = ref('2020/04/01')
const datasfirsit = ref('2020/04/27')
const starimaterial = ['NOU', 'FOLOSIT', 'CASARE']
const staremateriali = ref('NOU')
const datebalanta = ref([])
const datefisacont = ref([])
const parametrii_balanta = reactive({})
const parametrii_fisa = reactive({})
const totalstocfinal = ref(0)

const qDateProxy1 = ref(null)
const qDateProxy2 = ref(null)

let locuri = []
let materiale = []

const genLI = () => {
  afisezBalanta.value = false
  afisezListaInventariere.value = true
  afisezFisaCont.value = false
}

const genFisaCont = async () => {
  afisezBalanta.value = false
  afisezListaInventariere.value = false
  
  console.log('Material selectat...', materialselectat.value)

  const token = store.getters.token
  let categorii_param = toatecategoriile.value ? '*' : categoriei.value.value
  let locuri_param = toatelocurile.value ? '*' : locselectat.value.value
  let stari_param = toatestarile.value ? '*' : staremateriali.value
  
  console.log('GENEREZ FISA CONT', categorii_param, tipmaterial.value.value, locuri_param, stari_param, datainceput.value, datasfirsit.value)
  
  Object.assign(parametrii_fisa, {
    tipmaterial: tipmaterial.value.value,
    denumiretipmaterial: tipmaterial.value.label,
    denumireloc: toatelocurile.value ? 'Toate Locurile' : locselectat.value.label,
    denumirecategorie: toatecategoriile.value ? 'Toate Categoriile' : categoriei.value.label,
    datainceput: datainceput.value,
    datasfirsit: datasfirsit.value,
    idmaterial: materialselectat.value.value,
    denumirematerial: materialselectat.value.label,
    idgestiune: store.getters.gestiuneCurenta.id,
    gestiune: store.getters.gestiuneCurenta.denumire,
    categorii: categorii_param,
    locuri: locuri_param,
    stari: stari_param
  })
  
  try {
    const res = await axios.post(`${process.env.host}balante/fisacont`, parametrii_fisa, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    datefisacont.value = []
    let si = parseFloat(res.data.sifc[0][0].stocinitial)
    let vi = parseFloat(res.data.sifc[0][0].valoarestocinitial)
    
    datefisacont.value.push({
      data: '<' + datainceput.value,
      explicatii: 'SOLD INITIAL',
      um: '',
      ci: '',
      ce: '',
      cs: parseFloat(res.data.sifc[0][0].stocinitial).toFixed(2),
      vi: '',
      ve: '',
      vs: parseFloat(res.data.sifc[0][0].valoarestocinitial).toFixed(2)
    })
    
    res.data.tranzactii[0].map(t => {
      console.log('a sosist fisa de cont', si)
      let c_d = parseFloat(t.cantitate_debit)
      let c_c = parseFloat(t.cantitate_credit)
      let v_d = parseFloat(t.debit)
      let v_c = parseFloat(t.credit)
      si += (c_d - c_c)
      vi += (v_d - v_c)
      
      datefisacont.value.push({
        data: date.formatDate(t.data, 'DD.MM.YYYY'),
        explicatii: t.explicatii,
        um: t.um,
        ci: t.cantitate_debit,
        ce: t.cantitate_credit,
        cs: si.toFixed(2),
        vi: parseFloat(t.debit).toFixed(2),
        ve: parseFloat(t.credit).toFixed(2),
        vs: vi.toFixed(2)
      })
    })

    datefisacont.value.push({
      data: '<' + datasfirsit.value,
      explicatii: 'SOLD FINAL',
      um: '',
      ci: '',
      ce: '',
      cs: si.toFixed(2),
      vi: '',
      ve: '',
      vs: vi.toFixed(2)
    })

    afisezFisaCont.value = true
  } catch (err) {
    console.error('Fisa cont error:', err)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: 'EROARE GENERICA!'
    })
  }
}

const genBalanta = async () => {
  const token = store.getters.token
  let categorii_param = toatecategoriile.value ? '*' : categoriei.value.value
  let locuri_param = toatelocurile.value ? '*' : locselectat.value.value
  let stari_param = toatestarile.value ? '*' : staremateriali.value
  
  console.log('GENEREZ BALANTA', categorii_param, tipmaterial.value.value, locuri_param, stari_param, datainceput.value, datasfirsit.value)
  
  Object.assign(parametrii_balanta, {
    tipmaterial: tipmaterial.value.value,
    denumiretipmaterial: tipmaterial.value.label,
    denumireloc: toatelocurile.value ? 'Toate Locurile' : locselectat.value.label,
    denumirecategorie: toatecategoriile.value ? 'Toate Categoriile' : categoriei.value.label,
    datainceput: datainceput.value,
    datasfirsit: datasfirsit.value,
    idgestiune: store.getters.gestiuneCurenta.id,
    gestiune: store.getters.gestiuneCurenta.denumire,
    categorii: categorii_param,
    locuri: locuri_param,
    stari: stari_param
  })
  
  try {
    const res = await axios.post(`${process.env.host}balante/balantanoua`, parametrii_balanta, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('A sosit balanta...', datebalanta.value)
    datebalanta.value = []
    let nrcrt = 1
    let totalstoc = 0
    
    res.data.balanta[0].map((linie) => {
      datebalanta.value.push({
        nrcrt,
        id_reper: linie.id_reper,
        denumire: linie.denumire,
        um: linie.um,
        stocinitial: linie.stocinitial,
        ti: linie.ti,
        te: linie.te,
        stocfinal: linie.stocfinal,
        valoarestocinitial: parseFloat(linie.valoarestocinitial).toFixed(2),
        vi: parseFloat(linie.vi).toFixed(2),
        ve: parseFloat(linie.ve).toFixed(2),
        valoarestoc: parseFloat(linie.valoarestoc).toFixed(2),
      })
      nrcrt++
      totalstoc += parseFloat(linie.valoarestoc)
    })
    
    afisezBalanta.value = true
    afisezFisaCont.value = false
    totalstocfinal.value = totalstoc.toFixed(2)
    console.log('A sosit balanta...', datebalanta.value)
    afisezListaInventariere.value = false
  } catch (err) {
    console.error('Balanta error:', err)
    $q.notify({
      color: 'negative',
      timeout: 1500,
      position: 'top',
      icon: 'delete',
      message: 'EROARE GENERICA!'
    })
  }
}

const categoriiPerGestiunePerTip = async () => {
  const token = store.getters.token

  try {
    const res = await axios.get(`${process.env.host}categ/categoriilegestiunii/${store.getters.gestiuneCurenta.id}/${tipmaterial.value.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    categorii.value = []
    res.data.categorii.map(c => {
      categorii.value.push({
        id: c.id,
        label: c.denumire,
        value: c.id
      })
    })
  } catch (err) {
    console.error('Load categories error:', err)
  }
}

const filterFn = (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    materialelegestiunii.value = materiale.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const schimbTipMaterial = () => {
  console.log('schimb tip material', tipmaterial.value)
  categoriiPerGestiunePerTip()
}

const filterIFn = (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    locuriintrare.value = locuri.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const loadLocuri = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}locuri/toatelocurile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate locurile', res.data.locuri)
    locuriintrare.value = []
    locuri = []
    
    res.data.locuri.map(loc => {
      locuriintrare.value.push({
        id: loc.id,
        label: loc.denumire,
        value: loc.id
      })
    })
    
    locuri = [...locuriintrare.value]
    locselectat.value = locuriintrare.value[0]
  } catch (err) {
    console.error('Load locuri error:', err)
  }
}

const loadMateriale = async () => {
  const token = store.getters.token
  
  try {
    const res = await axios.get(`${process.env.host}materiale/toate/${store.getters.gestiuneCurenta.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Rspuns la toate materialele', res.data)
    materialelegestiunii.value = []
    materiale = []
    
    res.data.materiale.map(m => {
      materialelegestiunii.value.push({
        id: m.id,
        label: m.denumire,
        value: m.id,
        um: m.um,
        pretpredefinit: m.pretpredefinit,
        cod: m.cod_import,
        stoc: 9999
      })
    })
    
    materiale = [...materialelegestiunii.value]
  } catch (err) {
    console.error('Load materiale error:', err)
  }
}

const initializeDates = () => {
  const azi = new Date()
  const firstDay = new Date(azi.getFullYear(), azi.getMonth(), 1)
  const lastDay = new Date(azi.getFullYear(), azi.getMonth() + 1, 0)

  datainceput.value = date.formatDate(firstDay, 'YYYY/MM/DD')
  datasfirsit.value = date.formatDate(lastDay, 'YYYY/MM/DD')
}

onMounted(() => {
  initializeDates()
  loadLocuri()
  loadMateriale()
  categoriiPerGestiunePerTip()
})
</script>
