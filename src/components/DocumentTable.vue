<template>
  <q-table
    dense
    separator="cell"
    :data="documente"
    :columns="columns"
    :filter="filter"
    :pagination.sync="pagination"
    row-key="id"
    selection="single"
    :selected.sync="documenteselectate"
    no-data-label="Niciun document in intervalul selectat!"
  >
    <template v-slot:top>
      <q-btn  
        v-show="!documenteselectate.length === 0" 
        icon="low_priority" 
        flat 
        dense 
        color="primary"  
        label="Modifica" 
        @click="$emit('modifica-document')" 
      />
      <q-btn 
        v-show="!documenteselectate.length === 0" 
        class="on-right" 
        icon="delete_sweep" 
        flat 
        dense 
        color="primary"  
        label="Sterge" 
        @click="$emit('sterge-document')" 
      />
      <q-btn 
        class="on-right" 
        icon="print" 
        flat 
        dense 
        color="green"  
        :label="lblPrint" 
        @click="$emit('raport-doc-interval')" 
      />
      <q-space />
      <q-input  
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
    
    <template v-slot:bottom-row>
      <q-tr>
        <q-td style="text-align: center;" colspan="100%">
          Total debit: {{totaldebit}} lei    |    Total credit: {{totalcredit}} lei 
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'DocumentTable',
  props: {
    documente: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    documenteselectate: {
      type: Array,
      required: true
    },
    totaldebit: {
      type: String,
      required: true
    },
    totalcredit: {
      type: String,
      required: true
    },
    lblPrint: {
      type: String,
      required: true
    }
  },
  emits: ['modifica-document', 'sterge-document', 'raport-doc-interval']
}
</script>