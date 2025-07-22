<template>
  <q-page padding>
    <div class="row justify-center q-mt-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        hide-pagination
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <div class="text-body1 text-weight-bold">Referate de necesitate</div>
          
          <q-space />
          <q-btn 
            v-show="selected.length > 0" 
            class="on-right" 
            icon="print" 
            flat 
            dense 
            color="green" 
            label="PRINT" 
            @click="printRN" 
          />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="data" :props="props">
              {{ props.row.data }}
            </q-td>
            <q-td key="obiect_achizitie" :props="props">
              {{ props.row.obiect_achizitie }}
            </q-td>
            <q-td key="valoare" :props="props">
              {{ props.row.valoare }}
            </q-td>
            <q-td key="compartiment" :props="props">
              {{ props.row.compartiment }}
            </q-td>
            <q-td key="stare" :props="props">
              <q-badge color="purple">
                {{ props.row.stare }}
              </q-badge>
            </q-td>
            <q-td key="data_modificare" :props="props">
              {{ props.row.data_modificare }}
            </q-td>
          </q-tr>
        </template>
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

    <q-dialog 
      v-model="adaug_referat" 
      persistent 
      transition-show="scale" 
      transition-hide="scale"
    >
      <ref-necesitate-add @referat-nou="toateReferatele" />
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn 
        fab 
        icon="add" 
        color="accent" 
        @click="adaug_referat = true" 
      />
    </q-page-sticky>
    
    <q-page-sticky position="bottom-left" :offset="[24, 24]">
      <q-btn 
        fab 
        icon="settings_backup_restore" 
        color="accent" 
        @click="goToDashboard" 
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReferateListing } from '../composables/useReferateListing'
import ReferatNecesitateAdd from '../components/ReferatNecesitateAdd.vue'

const router = useRouter()

const {
  rows,
  selected,
  adaug_referat,
  pagination,
  columns,
  pagesNumber,
  printRN,
  toateReferatele
} = useReferateListing()

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(() => {
  console.log('Pagina principala Referate a fost creata!')
  toateReferatele()
})
</script>