<template>
<q-card style="width: 640px; max-width: 70vw;">
        <q-bar>
          <q-btn dense flat  :icon="panelActiv=='unul'?'list':'arrow_back'" @click="schimbaPanelActiv">
            <q-tooltip>{{panelActiv=='unul'?'Toate angajamentele legale':'Inapoi'}}</q-tooltip>
          </q-btn>
          <div>Angajamente legale</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
      <q-tab-panels v-model="panelActiv" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="unul">
          <div class="text-subtitle1">Ang. bugetar nr. {{angBugetar.nrdoc}} din {{angBugetar.dataang}} - {{angBugetar.detalii}}</div>
          <div class="text-subtitle2"> Categoria: {{angBugetar.categorie}} Art. bug. {{angBugetar.artbug}} <span class="text-right">Suma disponibila: {{angBugetar.suma}}</span></div>
           <div class="q-gutter-md row">
              <q-select
                filled
                v-model="furnizor"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="furnizori"
                @filter="filterFn"
                hint="Minimum 2 caractere pentru a cauta..."
                style="width: 250px; padding-bottom: 32px"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
          </div>
        </q-tab-panel>

        <q-tab-panel name="toate">
          <div class="text-h6">Toate ang. legale</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

      </q-tab-panels>

 
                       
</q-card>
</template>

<script>
import { defineComponent,ref,computed,inject } from 'vue'
import { date } from 'quasar'
import axios from 'axios'
import { useQuasar } from 'quasar'

const totiFurnizorii = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default defineComponent({
    name:'AngajamentLegal',
    props:['ang_bugetar'],
    setup (props, { emit }) {
       console.log('Prop ang legal',props.ang_bugetar)
       let furnizori=ref([])
       let furnizor = ref(null)
       let panelActiv = ref('unul')
        return {
            panelActiv,
            furnizori,
            furnizor,
            angBugetar:props.ang_bugetar,
            filterFn (val, update, abort) {
                if (val.length < 2) {
                  abort()
                  return
                }

                update(() => {
                  const needle = val.toLowerCase()
                  furnizori.value = totiFurnizorii.filter(v => v.toLowerCase().indexOf(needle) > -1)
                })
          },
            schimbaPanelActiv(){
               if(panelActiv.value=='unul')
                  panelActiv.value='toate'
               else
                  panelActiv.value='unul'

            }
        }
    }
})
</script>

<style scoped>

</style>