<template>
<q-card style="width: 480px; max-width: 70vw;">
                     <q-card-section>
                          <div class="text-h6">Adauga furnizor</div>
                       </q-card-section>

                        
                        <q-card-actions align="right" class="bg-white text-teal">
                          <q-btn flat label="Abandon" v-close-popup />
                          <q-space />
                          <q-btn flat label="Adauga"  />
                        </q-card-actions>
</q-card>
</template>

<script>
import { defineComponent,ref,computed } from 'vue'
import { date } from 'quasar'
export default defineComponent({
    name:'AddFurnizor',
    setup (props, { emit }) {
       

        return {
            
            
        }
    }
})
</script>

<style scoped>

</style>