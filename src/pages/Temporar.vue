<template>
  <span>
    <q-table 
      :id="uuid"
      :data="getFilteredValuesData"
      :columns="final_column"
      row-key="name" 
      :class="classes"  
      :visible-columns="visible_columns" 
      :pagination="pagination"
      :separator="separator" 
      :dense="dense" 
      :dark="dark" 
      :flat="flat" 
      :bordered="bordered"
      :square="square" 
      :selection="selection_prop" 
      v-model:selected="selected_prop" 
      :filter="filter"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width v-if="selection_prop != 'none'">
            <q-checkbox
              v-if="props.multipleSelect"
              v-model="props.selected"
              indeterminate-value="some"
            />
          </q-th>
          <q-th
            :props="props"
            @hover.stop
            v-for="col in props.cols"
            :key="col.name"
          >
            <div class="row inline">
              <div class="column">
                <p>{{ col.label }}</p>
              </div>
              <div class="column">
                <q-btn 
                  flat 
                  dense 
                  size="sm" 
                  icon="fa fa-filter" 
                  class="q-ml-xs" 
                  @click.stop 
                  v-if="header_filter"
                >
                  <q-icon 
                    name="fas fa-asterisk" 
                    color="red" 
                    style="font-size: 7px;"
                    v-if="column_options_selected[col.field]?.length > 0"
                  />
                  <q-menu>
                    <q-space/>

                    <q-btn 
                      dense 
                      class="float-right q-ma-sm bg-red text-white" 
                      round 
                      size="sm" 
                      v-close-popup 
                      flat
                      icon="close"
                    />

                    <div class="q-pa-sm q-mt-md">
                      <q-select 
                        map-options 
                        multiple 
                        emit-value 
                        filled 
                        v-model="column_options_selected[col.field]"
                        :options="column_options[col.field]" 
                        style="width: 150px !important;"
                      />
                    </div>
                    <q-btn 
                      color="primary" 
                      class="float-right q-mr-sm q-mb-sm text-capitalize" 
                      size="sm"
                      v-close-popup 
                      @click="clearColumnSelection(col.field)" 
                      label="Clear"
                    />
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-th>
        </q-tr>
        <q-tr :props="props" class="ignore-elements" v-if="columns_filter">
          <q-th auto-width v-if="selection_prop != 'none'">
          </q-th>
          <q-th :key="col.name" v-for="col in props.cols" style="padding: 0px 0px 0px 0px;">
            <q-input 
              v-if="!col.hasOwnProperty('filter_type') || col.filter_type == 'text'" 
              dense 
              color="teal"
              class="q-pl-xs q-pr-xs" 
              filled 
              v-model="filter_data[col.field]"
            >
              <template v-if="filter_data[col.field]" #append>
                <q-icon 
                  name="cancel" 
                  @click.stop="filter_data[col.field] = ''" 
                  class="cursor-pointer"
                />
              </template>
            </q-input>

            <q-select 
              v-if="col.hasOwnProperty('filter_type') && col.filter_type == 'select'" 
              map-options
              multiple 
              emit-value 
              filled 
              v-model="column_options_selected[col.field]"
              :options="column_options[col.field]" 
              dense
            >
              <template #append>
                <q-icon 
                  v-if="column_options_selected[col.field]?.length > 0" 
                  name="close"
                  @click.stop="clearColumnSelection(col.field)" 
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </q-th>
        </q-tr>
      </template>

      <template #top-right="props" v-if="excel_download || csv_download || fullscreen || global_search">
        <q-input 
          filled 
          v-if="global_search" 
          borderless 
          dense 
          debounce="300" 
          v-model="filter" 
          class="q-mr-md"
          placeholder="Search"
        >
          <template #append>
            <q-icon name="search"/>
          </template>
        </q-input>

        <q-btn
          class="bg-grey-2 q-mr-sm" 
          icon="fas fa-file-excel"
          no-caps 
          v-if="excel_download"
          @click="exportTable('xlsx')"
        />

        <q-btn
          class="bg-primary text-white" 
          icon="fas fa-file-csv"
          no-caps 
          v-if="csv_download"
          @click="exportTable('csv')"
        />

        <q-select 
          class="q-mr-sm q-ml-sm" 
          outlined 
          dense
          v-model="selected_group_by_filed" 
          v-if="groupby_filter"
          :options="gorupby_option" 
          style="width: 150px;"
        />

        <q-btn 
          v-if="fullscreen"
          flat
          round
          class="q-ml-sm"
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
          >
            {{ props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen' }}
          </q-tooltip>
        </q-btn>
      </template>

      <template #body="props">
        <q-tr :props="props" v-if="!hasDefaultSlot">
          <q-td v-if="selection_prop != 'none'">
            <q-checkbox color="primary" v-model="props.selected"/>
          </q-td>
          <q-td
            v-for="col, col_index in props.cols"
            :key="col.name"
            :props="props"
          >
            <q-btn 
              size="sm" 
              color="accent" 
              round 
              dense 
              @click="props.expand = !props.expand" 
              class="q-mr-sm"
              :icon="props.expand ? 'remove' : 'add'"
              v-if="groupby_filter && selected_group_by_filed['value'] != '' && col_index == 0"
            />

            {{ props.row[col.field] }}
          </q-td>
        </q-tr>
        <q-tr 
          v-if="groupby_filter && selected_group_by_filed['value'] != ''" 
          v-show="props.expand" 
          :props="props"
        >
          <q-td :colspan="2">
            <q-table
              :data="sub_grouped_data[props.row.name]"
              :columns="columns"
              row-key="name"
              :pagination="group_pagination"
              hide-bottom
            >
              <template #header="headerProps">
                <q-tr>
                  <q-th 
                    v-for="col in headerProps.cols"
                    :key="col.name" 
                    v-if="col.field != selected_group_by_filed"
                    :props="headerProps"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template #body="bodyProps">
                <q-tr :props="bodyProps">
                  <q-td 
                    :key="col.name" 
                    v-if="col.field != selected_group_by_filed" 
                    v-for="col in bodyProps.cols"
                    :props="bodyProps"
                  >
                    {{ bodyProps.row[col.field] }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-td>
        </q-tr>
        <slot name="body" v-bind:row="props.row" v-if="hasDefaultSlot">
        </slot>
      </template>
    </q-table>
  </span>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, useSlots } from 'vue'
import { useQuasar } from 'quasar'
import { uid, exportFile } from 'quasar'
import Sortable from 'sortablejs'

const props = defineProps([
  'data', 'columns', 'file_name', 'csv_download', 'excel_download', 
  'columns_filter', 'header_filter', 'draggable', 'classes', 'separator', 
  'dense', 'dark', 'flat', 'bordered', 'square', 'selection', 'selected', 
  'fullscreen', 'global_search', 'groupby_filter', 'visible_columns', 'pagination'
])

const emit = defineEmits(['selected-val'])
const $q = useQuasar()
const slots = useSlots()

const filter_data = reactive({})
const uuid = ref('')
const column_options = reactive({})
const column_options_selected = reactive({})
const filter_flags = reactive({})
const selection_prop = ref('')
const name = ref('')
const selected_prop = ref([])
const filter = ref('')
const gorupby_option = ref([])
const group_pagination = reactive({
  rowsPerPage: 0
})

const grouped_column = [
  {
    name: 'Grouped',
    required: true,
    label: 'Grouped Column Values',
    align: 'left',
    field: 'name',
    sortable: true
  }
]

const sub_grouped_data = reactive({})
const sub_grouped_columns = ref([])
const selected_group_by_filed = ref({ label: 'Group By Field', value: '' })
const final_column = ref([])

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val
  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)
  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}

const getFilteredData = computed(() => {
  const table_columns = final_column.value.map(item => item.field)
  const table_Data = props.data.filter(item => {
    for (let i = 0; i < table_columns.length; i++) {
      if (filter_data[table_columns[i]] == '') continue
      if (table_columns[i] in filter_data && 
          item[table_columns[i]].toString().toLowerCase().indexOf(filter_data[table_columns[i]].toLowerCase()) == -1) {
        return false
      }
    }
    return true
  })
  return table_Data
})

const getFilteredValuesData = computed(() => {
  let table_Data = getFilteredData.value.filter(item => {
    for (let i = 0; i < props.columns.length; i++) {
      if (column_options_selected[props.columns[i].field]?.length == 0) continue
      if (column_options_selected[props.columns[i].field]?.indexOf(item[props.columns[i].field].toString().toLowerCase()) == -1) {
        return false
      }
    }
    return true
  })
  
  if (props.groupby_filter && selected_group_by_filed.value['value'] != '') {
    const grouped_data = groupBy(table_Data, selected_group_by_filed.value['value'])
    table_Data = []
    Object.keys(grouped_data).filter(item => {
      table_Data.push({ name: item })
      return item
    })
    Object.assign(sub_grouped_data, grouped_data)
  }
  return table_Data
})

const hasDefaultSlot = computed(() => {
  return slots.hasOwnProperty('body')
})

const clearColumnSelection = (field) => {
  column_options_selected[field] = []
}

watch(selected_prop, () => {
  emit('selected-val', selected_prop.value)
}, { deep: true })

watch(selected_group_by_filed, () => {
  final_column.value = props.groupby_filter && selected_group_by_filed.value['value'] != '' 
    ? grouped_column 
    : props.columns
}, { deep: true })

const exportTable = (type) => {
  const content = [props.columns.map(col => wrapCsvValue(col.label))].concat(
    props.data.map(row => props.columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format
    )).join(','))
  ).join('\r\n')
  
  const status = exportFile(
    props.file_name + '.' + type,
    content,
    'text/' + type
  )
  
  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}

const groupBy = (array, key) => {
  const result = {}
  array.forEach(item => {
    if (!result[item[key]]) {
      result[item[key]] = []
    }
    result[item[key]].push(item)
  })
  return result
}

const setupSorting = () => {
  const dom = document.getElementById(uuid.value)
  const element = dom?.querySelector('table tbody')
  
  if (element) {
    Sortable.create(element, {
      disabled: !props.draggable,
      onEnd(event) {
        const tmp = props.data[event.oldIndex]
        props.data[event.oldIndex] = props.data[event.newIndex]
        props.data[event.newIndex] = tmp
      },
      onMove: function (evt) {
        if (evt.related.className == 'ignore-elements q-tr') {
          return false
        }
      },
    })
  }
}

const initializeComponent = () => {
  uuid.value = uid()
  
  selection_prop.value = props.selection === undefined ? 'none' : props.selection
  name.value = props.file_name === undefined ? 'Download' : props.file_name
  selected_prop.value = props.selected === undefined ? [] : props.selected
  
  gorupby_option.value = [{ label: 'Group By Field', value: '' }]
  
  props.columns.filter(item => {
    column_options[item.field] = []
    column_options_selected[item.field] = []
    filter_flags[item.field] = false
    filter_data[item.field] = ''
    
    if (item.hasOwnProperty('grouping') && item.grouping) {
      gorupby_option.value.push({ label: item.label, value: item.field })
    }
    return item
  })
  
  props.data.filter(item => {
    props.columns.filter(column => {
      column_options[column.field].push({
        label: item[column.field].toString(),
        value: item[column.field].toString().toLowerCase().replace(/_/g, '_')
      })
    })
  })
  
  props.columns.filter(column => {
    column_options[column.field] = [...new Map(column_options[column.field].map(item =>
      [item['value'], item])).values()]
  })
  
  final_column.value = selected_group_by_filed.value['value'] != '' ? grouped_column : props.columns
}

onMounted(() => {
  initializeComponent()
  setupSorting()
})
</script>

<style scoped>
</style>