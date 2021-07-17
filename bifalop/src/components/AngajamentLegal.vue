<template>
<q-card style="width: 800px; max-width: 70vw;">
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
           <div class="q-pa-sm q-gutter-md row">
              <q-select
                label="Furnizor"
                v-model="furnizor"
                use-input
                :options="furnizori"
                @filter="filterFn"
                hint="Min 2 caractere pentru a cauta..."
                style="width: 200px; padding-bottom: 16px"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input  v-model="nrcontract" label="Nr. contract" stack-label  />

              <q-input style="width: 140px; padding-bottom: 16px" label="Data contract" stack-label v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

             <q-input v-model="valoare"  label="Valoare" stack-label  />

          </div>
         <div class="row items-center justify-center">
                        <q-btn v-close-popup label="Adauga" color="primary" flat />
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

let totiFurnizorii = [

]

export default defineComponent({
    name:'AngajamentLegal',
    props:['ang_bugetar'],
    setup (props, { emit }) {
        const global=inject('global');
        const token=global.state.user.token;
        const compartiment=global.state.user.compartiment;
        let idcompartiment=compartiment=='SUPERVIZARE'? 0:global.state.user.nume_logare;

        /**
         * 
        incarc furnizorii

         */

        axios.get(process.env.host+`furnizori/toti/${idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

                    res => {
                    console.log('Raspuns la toti furnizorii',res.data);
                    totiFurnizorii=[];
                    res.data.furnizori.map(f=>{
                       totiFurnizorii.push(f)
                    })
                
                    }
                ).catch(err =>{})

       console.log('Prop ang legal',props.ang_bugetar)
       let furnizori=ref([])
       let furnizor = ref(null)
       let nrcontract=ref("")
       let valoare=ref(0)
       let panelActiv = ref('unul')
        return {
            panelActiv,
            furnizori,
            furnizor,
            nrcontract,
            valoare,
            angBugetar:props.ang_bugetar,
            filterFn (val, update, abort) {
                if (val.length < 2) {
                  abort()
                  return
                }

                update(() => {
                  const needle = val.toLowerCase()
                  console.log('toti furnizorii',totiFurnizorii)
                  furnizori.value = totiFurnizorii.filter(v => v.denumire.toLowerCase().indexOf(needle) > -1)
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