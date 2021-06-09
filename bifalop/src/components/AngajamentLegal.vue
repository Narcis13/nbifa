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



export default defineComponent({
    name:'AngajamentLegal',
    props:['ang_bugetar'],
    setup (props, { emit }) {
       console.log('Prop ang legal',props.ang_bugetar)
       let panelActiv = ref('unul')
        return {
            panelActiv,
            angBugetar:props.ang_bugetar,
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