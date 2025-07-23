<template>
  <q-tabs
    v-model="activeTab"
    class="text-teal"
    style="width:240px"
  >
    <q-tab v-if="iesirivizibile" name="tabiesiri" icon="fast_rewind" label="Iesire" />
    <q-tab v-if="intrarivizibile" name="tabintrari" icon="fast_forward" label="Intrare" />
  </q-tabs>

  <q-tab-panels
    v-model="activeTab"
    animated
    transition-prev="jump-up"
    transition-next="jump-up"
  >
    <q-tab-panel name="tabiesiri">
      <div class="q-gutter-sm column">
        <q-select
          filled
          dense
          v-model="lociesire"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Loc dispunere"
          :options="locuriiesireFiltrate"
          @filter="filterLocuriIesire"
          style="width: 225px;"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          outlined
          v-model="categoriee"
          dense
          label="Categorie reper"
          @input="$emit('selecteaza-categorie-iesire')"
          :options="categorii"
          style="width: 225px;"
        />

        <q-select
          filled
          v-model="materialiesire"
          use-input
          hide-selected
          dense
          fill-input
          input-debounce="0"
          label="Denumire"
          :options="materialeiesireFiltrate"
          style="width:225px;"
          options-selected-class="text-deep-orange"
          @filter="filterMaterialeIesire"
          @input="$emit('material-iesire-selectat', $event)"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label>{{ scope.opt.label }} ({{scope.opt.um}}) - {{scope.opt.stare}}</q-item-label>
                <q-item-label>Pret mediu: {{ scope.opt.pretpredefinit }} Stoc curent: {{scope.opt.stoc}}</q-item-label>
                <q-item-label>Cod: {{scope.opt.cod}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>  

        <q-select 
          dense 
          outlined 
          v-model="staremateriale" 
          :options="starimaterial" 
          label="Stare material" 
          style="width:225px;"
        />  
      </div>
    </q-tab-panel>

    <q-tab-panel name="tabintrari">
      <div class="q-gutter-sm column">
        <q-select
          filled
          dense
          v-model="locintrare"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Loc dispunere"
          :options="locuriintrareFiltrate"
          @filter="filterLocuriIntrare"
          style="width: 225px;"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Niciun rezultat
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          outlined
          v-model="categoriei"
          dense
          label="Categorie reper"
          :options="categorii"
          style="width: 225px;"
        />

        <q-select
          filled
          clearable
          v-model="materialintrare"
          use-input
          hide-selected
          dense
          fill-input
          input-debounce="0"
          label="Denumire"
          :readonly="eTransfer"
          :options="materialeintrarefiltrate"
          style="width:225px;"
          @filter="filterMaterialeIntrare"
          @input="$emit('material-intrare-selectat', $event)"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Material inexistent
                <material-add 
                  :mat="materialintrare" 
                  :data="materialeintrare" 
                  @materialnou="$emit('material-adaugat', $event)"
                />
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section>
                <q-item-label>{{ scope.opt.label }} ({{scope.opt.um}})</q-item-label>
                <q-item-label>Cod: {{scope.opt.cod}}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>  

        <q-select 
          dense 
          outlined 
          v-model="staremateriali" 
          :options="starimaterial" 
          label="Stare material" 
          style="width:225px;"
        />                               
      </div>
    </q-tab-panel>
  </q-tab-panels>  

  <div class="q-gutter-sm q-pa-md column">
    <q-input  
      readonly 
      filled 
      v-model="um" 
      label="UM" 
      style="width:100px;" 
      dense 
    />
    <q-input  
      type="number" 
      filled 
      ref="ed_cantitate" 
      v-model.number="cantitate" 
      label="Cantitate" 
      style="width:150px;" 
      dense 
      error-message="Cantitate invalida!"  
      :error="!cantitateValida"
    />
    <q-input 
      :readonly="iesirivizibile" 
      type="number" 
      filled 
      v-model.number="pretunitar" 
      label="Pret" 
      style="width:150px;" 
      dense 
      :rules="[
        val => val !== null && val !== '' || 'Introduceti pretul unitar'
      ]"
    />
    <div class="text-h6">{{valoareunitara}} lei</div>
    <div class="column q-pa-md items-center">
      <q-btn  
        :disable="!PotAdaugaReper" 
        icon="create"  
        color="secondary" 
        flat 
        :label="modMODREPER > 0 ? 'Modifica' : 'Adauga'" 
        @click="$emit('adauga-reper')"
      />
    </div>
  </div>
</template>

<script>
import MaterialAdd from './MaterialAdd.vue'

export default {
  name: 'MaterialSelection',
  components: {
    'material-add': MaterialAdd
  },
  props: {
    activeTab: {
      type: String,
      required: true
    },
    iesirivizibile: Boolean,
    intrarivizibile: Boolean,
    eTransfer: Boolean,
    lociesire: Object,
    locintrare: Object,
    locuriiesire: Array,
    locuriintrare: Array,
    categoriee: Object,
    categoriei: Object,
    categorii: Array,
    materialiesire: Object,
    materialintrare: Object,
    materialeiesire: Array,
    materialeintrare: Array,
    staremateriale: String,
    staremateriali: String,
    starimaterial: Array,
    um: String,
    cantitate: Number,
    cantitateValida: Boolean,
    pretunitar: Number,
    valoareunitara: String,
    PotAdaugaReper: Boolean,
    modMODREPER: Number
  },
  data() {
    return {
      locuriiesireFiltrate: [],
      locuriintrareFiltrate: [],
      materialeiesireFiltrate: [],
      materialeintrarefiltrate: []
    }
  },
  mounted() {
    this.locuriiesireFiltrate = [...this.locuriiesire]
    this.locuriintrareFiltrate = [...this.locuriintrare]
    this.materialeiesireFiltrate = [...this.materialeiesire]
    this.materialeintrarefiltrate = [...this.materialeintrare]
  },
  watch: {
    locuriiesire: {
      handler(newVal) {
        this.locuriiesireFiltrate = [...newVal]
      },
      deep: true
    },
    locuriintrare: {
      handler(newVal) {
        this.locuriintrareFiltrate = [...newVal]
      },
      deep: true
    },
    materialeiesire: {
      handler(newVal) {
        this.materialeiesireFiltrate = [...newVal]
      },
      deep: true
    },
    materialeintrare: {
      handler(newVal) {
        this.materialeintrarefiltrate = [...newVal]
      },
      deep: true
    }
  },
  methods: {
    filterLocuriIesire(val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.locuriiesireFiltrate = this.locuriiesire.filter(v => 
          v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    filterLocuriIntrare(val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.locuriintrareFiltrate = this.locuriintrare.filter(v => 
          v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    filterMaterialeIesire(val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.materialeiesireFiltrate = this.materialeiesire.filter(v => 
          v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    filterMaterialeIntrare(val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.materialeintrarefiltrate = this.materialeintrare.filter(v => 
          v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    }
  },
  emits: [
    'selecteaza-categorie-iesire', 
    'material-iesire-selectat', 
    'material-intrare-selectat', 
    'material-adaugat', 
    'adauga-reper'
  ]
}
</script>