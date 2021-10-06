<template>
  <div class="q-pa-md ">
    
    <div class="row">
      <div class="col-8">
         grid
      </div>
      <div class="col-4">
         <div class="q-pa-md" >
              <q-list bordered padding class="rounded-borders text-primary">
                <q-item
                  clickable
                  v-ripple
                  :active="link === 'id1'"
                  @click="link = 'id1'"
                  active-class="my-menu-link"
                >
                  <q-item-section>
                    <q-item-label>Contract A1233 din 07/04/2022</q-item-label>
                    <q-item-label>Servicii colectare deseuri Valoare :10236</q-item-label>
                    <q-item-label caption>
                      SC SALUBRITATE SA
                    </q-item-label>
                  </q-item-section>
                </q-item>

                    <q-item
                  clickable
                  v-ripple
                  :active="link === 'id2'"
                  @click="link = 'id2'"
                  active-class="my-menu-link"
                >
                  <q-item-section>
                    <q-item-label>Contract A1233 din 07/04/2022</q-item-label>
                    <q-item-label>Servicii colectare deseuri Valoare :10236</q-item-label>
                    <q-item-label caption>
                      SC SALUBRITATE SA
                    </q-item-label>
                  </q-item-section>
                </q-item>
                      <q-item
                  clickable
                  v-ripple
                  :active="link === 'inbox'"
                  @click="link = 'inbox'"
                  active-class="my-menu-link"
                >
                  <q-item-section>
                    <q-item-label>Contract A1233 din 07/04/2022</q-item-label>
                    <q-item-label>Servicii colectare deseuri Valoare :10236</q-item-label>
                    <q-item-label caption>
                      SC SALUBRITATE SA
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
      </div>

    </div>

      <div class="bg-blue text-white text-center q-pa-md q-mt-md flex flex-center">
       <q-btn
       
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent , ref} from 'vue'

export default defineComponent({
  name: 'Lichidari',
  setup(){
    return {
      link: ref('id1')
    }
  }
})
</script>

<style>
.my-menu-link {
  color: white;
  background: #F2C037;
  }
</style>
