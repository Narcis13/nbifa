<template>
  <q-page padding>
    <div class="flex flex-center column">
      <bara-interval-documente 
        ref="barainterval" 
        v-if="vreauGrid" 
        @new-data="handleNewData" 
      />
      
      <DocumentTable
        v-if="vreauGrid"
        :documente="documente"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :documenteselectate="documenteselectate"
        :totaldebit="totaldebit"
        :totalcredit="totalcredit"
        :lblPrint="lblPrint"
        @modifica-document="modificaDocument"
        @sterge-document="stergeDocument"
        @raport-doc-interval="raportDocInterval"
      />
    </div>

    <q-page-sticky v-if="vreauGrid" position="bottom-right" :offset="[24, 24]">
      <q-btn fab :icon="PotAdaugaDocument ? 'warning' : 'add'" color="accent" @click="docNou" />
    </q-page-sticky>

    <div class="row">
      <div v-if="vreauLista" class="col-2 q-pa-sm">
        <q-scroll-area style="height: 85vh;">
          <q-list v-for="d in documente" :key="d.id" bordered separator>
            <q-item clickable v-ripple @click="rapDoc(d.id)">
              <q-item-section>
                <q-item-label overline>{{d.tipoperatiune}} {{d.nrdoc}}</q-item-label>
                <q-item-label>{{d.data}}</q-item-label>
                <q-item-label>{{d.valoare}} lei</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" :name="d.icon" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
      
      <div v-if="vreauFormular" id="formular" class="col-10 q-pa-sm">
        <DocumentHeader
          :tipmaterial="tipmaterial"
          :tipurirepere="tipurirepere"
          :tipdocument="tipdocument"
          :tipuridocumente="tipuridocumente"
          :datadoc="datadoc"
          :nrdoc="nrdoc"
          @change-tip-material="handleChangeTipMaterial"
          @tip-document-selectat="handleTipDocumentSelectat"
        />

        <q-splitter v-model="splitterModel" style="margin-top: 25px;">
          <template v-slot:before>
            <MaterialSelection
              :activeTab="tab"
              :iesirivizibile="iesirivizibile"
              :intrarivizibile="intrarivizibile"
              :eTransfer="eTransfer"
              :lociesire="lociesire"
              :locintrare="locintrare"
              :locuriiesire="locuriiesire"
              :locuriintrare="locuriintrare"
              :categoriee="categoriee"
              :categoriei="categoriei"
              :categorii="categorii"
              :materialiesire="materialiesire"
              :materialintrare="materialintrare"
              :materialeiesire="materialeiesire"
              :materialeintrare="materialeintrare"
              :staremateriale="staremateriale"
              :staremateriali="staremateriali"
              :starimaterial="starimaterial"
              :um="um"
              :cantitate="cantitate"
              :cantitateValida="cantitateValida"
              :pretunitar="pretunitar"
              :valoareunitara="valoareunitara"
              :PotAdaugaReper="PotAdaugaReper"
              :modMODREPER="modMODREPER"
              @selecteaza-categorie-iesire="handleSelectezCategorieIesire"
              @material-iesire-selectat="handleMaterialIesireSelectat"
              @material-intrare-selectat="handleMaterialIntrareSelectat"
              @material-adaugat="handleMaterialAdaugat"
              @adauga-reper="handleAdaugaReper"
            />
          </template>

          <template v-slot:after>
            <div class="q-pa-md" style="min-width:450px">
              <Repere :repere="repere" @mod-linie="handleModLinie" />
            </div>
          </template>
        </q-splitter>
        
        <div class="row q-pa-md justify-center">
          <q-btn 
            :disable="!PotAdaugaDocument" 
            icon="save_alt" 
            @click="salveazaDocument" 
            color="secondary" 
            flat 
            :label="!modMOD ? 'Salveaza' : 'Modifica'"  
          />
          <q-btn  
            icon="repeat" 
            @click="resetDocument" 
            color="secondary" 
            flat 
            label="Reset"  
          />
          <q-btn  
            icon="description" 
            @click="clickDocumente" 
            color="secondary" 
            flat 
            label="Documente..."  
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

import { useDocuments } from '../composables/useDocuments'
import { useMaterials } from '../composables/useMaterials'
import { useLocations } from '../composables/useLocations'

import Repere from '../components/Repere.vue'
import MaterialAdd from '../components/MaterialAdd.vue'
import BaraIntervalDocumente from '../components/BaraIntervalDocumente.vue'
import DocumentHeader from '../components/DocumentHeader.vue'
import MaterialSelection from '../components/MaterialSelection.vue'
import DocumentTable from '../components/DocumentTable.vue'

export default {
  name: 'Documente',
  components: {
    Repere,
    'material-add': MaterialAdd,
    'bara-interval-documente': BaraIntervalDocumente,
    DocumentHeader,
    MaterialSelection,
    DocumentTable
  },
  setup() {
    const instance = getCurrentInstance()
    const store = useStore()
    
    const {
      documente,
      documenteselectate,
      tipuridocumente,
      tipdocument,
      nrdoc,
      datadoc,
      repere,
      modMOD,
      modMODREPER,
      filter,
      pagination,
      columns,
      totaldebit,
      totalcredit,
      lblPrint,
      PotAdaugaDocument,
      intrarivizibile,
      iesirivizibile,
      eTransfer,
      initializareTipuriDocumente,
      newData,
      salveazaDocument,
      modificaDocument,
      stergeDocument,
      resetDocument,
      initializareData
    } = useDocuments()
    
    const {
      materiale,
      materialeintrare,
      materialeiesire,
      materialintrare,
      materialiesire,
      cantitate,
      cantitate_maxima,
      pretunitar,
      um,
      categorii,
      categoriei,
      categoriee,
      staremateriali,
      staremateriale,
      tipmaterial,
      tipurirepere,
      starimaterial,
      cantitateValida,
      valoareunitara,
      doarvaloare,
      PotAdaugaReper,
      initializareMateriale,
      categoriiPerGestiunePerTip,
      materialIntrareSelectat,
      materialIesireSelectat,
      schimbTipMaterial,
      selectezCategorieIesire,
      materialAdaugat,
      resetMateriale,
      resetCategoriiStare
    } = useMaterials()
    
    const {
      locuri,
      locuriintrare,
      locuriiesire,
      locintrare,
      lociesire,
      initializareLocuri,
      resetLocuri
    } = useLocations()
    
    const tab = ref('tabintrari')
    const splitterModel = ref(20)
    const vreauGrid = ref(true)
    const vreauLista = ref(false)
    const vreauFormular = ref(false)
    const barainterval = ref(null)
    
    const handleNewData = (data) => {
      newData(data)
    }
    
    const handleChangeTipMaterial = (newTipMaterial) => {
      tipmaterial.value = newTipMaterial
      schimbTipMaterial()
    }
    
    const handleTipDocumentSelectat = () => {
      if (tipdocument.value.tip === 'e' || tipdocument.value.tip === 't') {
        tab.value = 'tabiesiri'
      } else {
        tab.value = 'tabintrari'
      }
      resetMateriale()
      resetCategoriiStare()
      resetLocuri()
    }
    
    const handleSelectezCategorieIesire = () => {
      selectezCategorieIesire(lociesire.value)
    }
    
    const handleMaterialIntrareSelectat = (value) => {
      materialIntrareSelectat(value)
    }
    
    const handleMaterialIesireSelectat = (value) => {
      materialIesireSelectat(value)
      if (tipdocument.value.tip === 't') {
        materialintrare.value = value
      }
    }
    
    const handleMaterialAdaugat = (material) => {
      materialAdaugat(material)
    }
    
    const handleAdaugaReper = () => {
      if (modMODREPER.value > 0) {
        repere.value.map(r => {
          if (r.nrcrt === modMODREPER.value) {
            r.nrcrt = modMODREPER.value
            r.categ = tipdocument.value.tip === 'i' ? categoriei.value.label : categoriee.value.label
            r.id_categ = tipdocument.value.tip === 'i' ? categoriei.value.value : categoriee.value.value
            r.denumire_reper = tipdocument.value.tip === 'i' ? materialintrare.value.label : materialiesire.value.label
            r.id_reper = tipdocument.value.tip === 'i' ? materialintrare.value.value : materialiesire.value.value
            r.um = um.value
            r.cantitate = cantitate.value
            r.pret = pretunitar.value
            r.valoare = doarvaloare.value
            r.tipmaterial = tipmaterial.value.value
            r.tip = tipdocument.value.tip
            r.id_locintrare = locintrare.value ? locintrare.value.id : null
            r.id_lociesire = lociesire.value ? lociesire.value.id : null
            r.id_categ_intrare = categoriei.value ? categoriei.value.value : null
            r.id_categ_iesire = categoriee.value ? categoriee.value.value : null
            r.stare_material_intrare = staremateriali.value
            r.stare_material_iesire = staremateriale.value
          }
        })
      } else {
        repere.value.push({
          nrcrt: repere.value.length + 1,
          categ: tipdocument.value.tip === 'i' ? categoriei.value.label : categoriee.value.label,
          id_categ: tipdocument.value.tip === 'i' ? categoriei.value.value : categoriee.value.value,
          denumire_reper: tipdocument.value.tip === 'i' ? materialintrare.value.label : materialiesire.value.label,
          id_reper: tipdocument.value.tip === 'i' ? materialintrare.value.value : materialiesire.value.value,
          um: um.value,
          cantitate: cantitate.value,
          pret: pretunitar.value,
          valoare: doarvaloare.value,
          tipmaterial: tipmaterial.value.value,
          tip: tipdocument.value.tip,
          id_locintrare: locintrare.value ? locintrare.value.id : null,
          id_lociesire: lociesire.value ? lociesire.value.id : null,
          id_categ_intrare: categoriei.value ? categoriei.value.value : null,
          id_categ_iesire: categoriee.value ? categoriee.value.value : null,
          stare_material_intrare: staremateriali.value,
          stare_material_iesire: staremateriale.value
        })
      }
      
      resetMateriale()
      modMODREPER.value = -1
    }
    
    const handleModLinie = (d) => {
      modMODREPER.value = d.nrcrt
      pretunitar.value = d.pret
      um.value = d.um
      cantitate.value = d.cantitate

      tipurirepere.map(t => {
        if (t.value === d.tipmaterial) {
          tipmaterial.value = t
          categoriiPerGestiunePerTip()
        }
      })

      categorii.value.map(c => {
        if (c.id === d.id_categ_intrare) categoriei.value = c
        if (c.id === d.id_categ_iesire) categoriee.value = c
      })

      locuri.value.map(l => {
        if (l.id === d.id_locintrare) locintrare.value = l
        if (l.id === d.id_lociesire) lociesire.value = l
      }) 
      
      materiale.value.map(m => {
        if (m.id === d.id_reper) materialintrare.value = m
        if (m.id === d.id_reper) materialiesire.value = m
      })
    }
    
    const docNou = () => {
      vreauGrid.value = false
      vreauLista.value = true
      vreauFormular.value = true
    }
    
    const clickDocumente = () => {
      vreauGrid.value = true
      vreauLista.value = false
      vreauFormular.value = false
    }
    
    const raportDocInterval = () => {
      if (documenteselectate.value.length === 0) {
        barainterval.value.raportToateDocumentele(
          store.getters.gestiuneCurenta.id, 
          store.getters.gestiuneCurenta.denumire
        )
      } else {
        barainterval.value.raportUnDocument(documenteselectate.value[0].id)
      }
    }
    
    const rapDoc = (id) => {
      window.open(`${process.env.host}rapoarte/undocument/${id}`, '_blank')
    }
    
    const schimbaGestiunea = (id) => {
      barainterval.value.schimbaGestiunea(id)
    }
    
    onMounted(async () => {
      initializareData()
      
      instance.proxy.$root.$on('materialadaugat', handleMaterialAdaugat)
      instance.proxy.$root.$on('schimbgestiunea', schimbaGestiunea)
      
      await initializareTipuriDocumente()
      await initializareLocuri()
      await initializareMateriale()
      await categoriiPerGestiunePerTip()
    })
    
    onBeforeUnmount(() => {
      instance.proxy.$root.$off('schimbgestiunea', schimbaGestiunea)
    })
    
    return {
      documente,
      documenteselectate,
      tipuridocumente,
      tipdocument,
      nrdoc,
      datadoc,
      repere,
      modMOD,
      modMODREPER,
      filter,
      pagination,
      columns,
      totaldebit,
      totalcredit,
      lblPrint,
      PotAdaugaDocument,
      intrarivizibile,
      iesirivizibile,
      eTransfer,
      materiale,
      materialeintrare,
      materialeiesire,
      materialintrare,
      materialiesire,
      cantitate,
      pretunitar,
      um,
      categorii,
      categoriei,
      categoriee,
      staremateriali,
      staremateriale,
      tipmaterial,
      tipurirepere,
      starimaterial,
      cantitateValida,
      valoareunitara,
      PotAdaugaReper,
      locuriintrare,
      locuriiesire,
      locintrare,
      lociesire,
      tab,
      splitterModel,
      vreauGrid,
      vreauLista,
      vreauFormular,
      barainterval,
      handleNewData,
      handleChangeTipMaterial,
      handleTipDocumentSelectat,
      handleSelectezCategorieIesire,
      handleMaterialIntrareSelectat,
      handleMaterialIesireSelectat,
      handleMaterialAdaugat,
      handleAdaugaReper,
      handleModLinie,
      docNou,
      clickDocumente,
      raportDocInterval,
      rapDoc,
      salveazaDocument,
      modificaDocument,
      stergeDocument,
      resetDocument
    }
  }
}
</script>

<style scoped>
#formular {
  border: 2px solid black;
}
</style>