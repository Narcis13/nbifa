<template>
  <q-page padding>
    <div class="q-gutter-md column items-start">
      <material-add :data="materiale" @materialnou="materialAdaugat" />
      <q-separator inset />
      
      <q-table
        title="Lista Materiale"
        :rows="materiale"
        separator="cell"
        :columns="columns"
        row-key="id"
        :filter="filter"
        selection="single"
        v-model:selected="selected"
        v-model:pagination="pagination"
        rows-per-page-label="Inregistrari pe pagina"
      >
        <template v-slot:top>
          <q-btn 
            class="on-right" 
            outline 
            rounded 
            color="primary" 
            icon="delete_sweep" 
            label="Sterge" 
            @click="deleteRow" 
          />
          <q-space />
          <q-input 
            borderless 
            dense 
            debounce="300" 
            color="primary" 
            v-model="filter" 
            placeholder="Cauta"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="id" :props="props">{{ props.row.id }}</q-td>
            <q-td key="denumire" :props="props">
              <div :style="{ color: props.row.eNou ? 'blue' : 'black' }">
                {{ props.row.denumire }}
              </div>
              
              <q-popup-edit 
                buttons 
                v-model="props.row.denumire" 
                @save="editeaza(props.row.id, 'denumire', props.row.denumire)"
              >
                <q-input v-model="props.row.denumire" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="um" :props="props">
              {{ props.row.um }}
              <q-popup-edit 
                buttons 
                v-model="props.row.um" 
                @save="editeaza(props.row.id, 'um', props.row.um)"
              >
                <q-input v-model="props.row.um" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="pretpredefinit" :props="props">
              {{ props.row.pretpredefinit }}
              <q-popup-edit 
                buttons 
                v-model="props.row.pretpredefinit" 
                @save="editeaza(props.row.id, 'pretpredefinit', props.row.pretpredefinit)"
              >
                <q-input v-model="props.row.pretpredefinit" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="gestiune" :props="props">
              {{ props.row.gestiune }}
            </q-td>
            <q-td key="user" :props="props">
              {{ props.row.user }}
            </q-td>
            <q-td key="codimport" :props="props">
              {{ props.row.cod_import }}
            </q-td>
            <q-td key="datamodificare" :props="props">
              {{ props.row.datamodificare }}
            </q-td>
          </q-tr>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { useMaterialeCrud } from '../composables/useMaterialeCrud'
import MaterialAdd from '../components/MaterialAdd.vue'

const {
  materiale,
  filter,
  selected,
  pagination,
  columns,
  editeaza,
  deleteRow,
  materialAdaugat
} = useMaterialeCrud()
</script>