<template>
  <div>
    <q-table
      v-if="showTable"
      :rows="filteredUsers"
      :columns="column_defs"
      :loading="loading"
      dense
      dark
      :title="niceTitle"
      selection="single"
      v-model:selected="selected"
      @selection="handleSelection"
      row-key="index"
      :filter="filter"
      :pagination="pagination"
      @update:pagination="updatePagination"
    >
      <template v-slot:top>
        <q-btn 
          dense 
          dark 
          color="primary" 
          :disable="loading" 
          label="Add row" 
          @click="addrow" 
        />
        <q-space />
        <q-input 
          outlined 
          dense 
          dark 
          debounce="300" 
          color="primary" 
          v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox
              v-model="props.selected"
              dense
            />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top-right>
        <q-select
          v-model="group"
          :options="options"
          label="Group by"
          dense
          outlined
          dark
          emit-value
          map-options
          style="min-width: 150px"
        />
      </template>

      <template v-slot:bottom>
        <q-btn
          flat
          dense
          icon="print"
          label="Print"
          @click="handlePrint"
        />
      </template>
    </q-table>

    <div v-else>Lista de inventariere</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { useInventariereTable } from '../composables/useInventariereTable'

const props = defineProps({
  setdate: {
    type: String,
    default: ''
  }
})

// Control table visibility
const showTable = ref(true)

// Use the composable
const {
  selected,
  loading,
  filter,
  group,
  options,
  niceTitle,
  column_defs,
  users,
  filteredUsers,
  groupedUsers,
  get_selection,
  addrow,
  remove,
  loadData
} = useInventariereTable()

// Pagination
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

// Methods
const handleSelection = ({ rows, added, evt }) => {
  if (added) {
    get_selection(rows)
  }
}

const updatePagination = (newPagination) => {
  pagination.value = newPagination
}

const handlePrint = () => {
  // Print functionality
  window.print()
}

// Computed property for grouped data display
const displayData = computed(() => {
  if (group.value === ':nothing') {
    return filteredUsers.value
  }
  
  // For grouped data, we need to flatten it for q-table
  // In a real implementation, you might want to use expansion rows
  const flatData = []
  Object.entries(groupedUsers.value).forEach(([groupKey, groupItems]) => {
    // Add group header
    flatData.push({
      _isGroupHeader: true,
      _groupKey: groupKey,
      _groupCount: groupItems.length,
      index: `group-${groupKey}`
    })
    // Add group items
    flatData.push(...groupItems)
  })
  
  return flatData
})

// Update pagination when data changes
const updateRowsNumber = () => {
  pagination.value.rowsNumber = filteredUsers.value.length
}

// Lifecycle
onMounted(() => {
  loadData()
  updateRowsNumber()
})

// Watch for filter changes to update pagination
</script>

<style scoped>
</style>