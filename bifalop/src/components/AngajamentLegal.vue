<template>
<q-card style="width: 320px; max-width: 70vw;">
        <q-bar>
          <q-btn dense flat  icon="crop_square">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
          <div>Your Next Steps</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
 
                       
</q-card>
</template>

<script>
import { defineComponent,ref,computed,inject } from 'vue'
import { date } from 'quasar'
import axios from 'axios'
import { useQuasar } from 'quasar'



export default defineComponent({
    name:'AngajamentLegal',
   // props:['furnizori'],
    setup (props, { emit }) {
       
        return {
            
        }
    }
})
</script>

<style scoped>

</style>