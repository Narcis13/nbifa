<template>
  <div class="row q-pa-md">
    <q-btn-group rounded>
      <q-btn 
        rounded 
        color="primary" 
        label="Luna aceasta" 
        @click="SchimbaInterval(0)"
      />

      <q-btn 
        rounded 
        color="primary" 
        label="Luna trecuta" 
        @click="SchimbaInterval(1)"
      />
      
      <q-btn 
        rounded 
        color="primary" 
        label="Anul acesta" 
        @click="SchimbaInterval(2)"
      />

      <q-btn-dropdown 
        rounded 
        color="primary" 
        label="Alta perioada"
      >
        <q-card>
          <q-card-section>
            <q-input 
              filled 
              label="De la" 
              v-model="datainceput" 
              mask="date" 
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy 
                    ref="qDateProxy1" 
                    transition-show="scale" 
                    transition-hide="scale"
                  >
                    <q-date 
                      v-model="datainceput" 
                      @update:model-value="() => qDateProxy1.hide()" 
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            
            <q-input 
              filled 
              label="La" 
              v-model="datasfirsit" 
              mask="date" 
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy 
                    ref="qDateProxy2" 
                    transition-show="scale" 
                    transition-hide="scale"
                  >
                    <q-date 
                      v-model="datasfirsit" 
                      @update:model-value="() => qDateProxy2.hide()" 
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions vertical>
            <q-btn 
              flat 
              v-close-popup 
              @click="SchimbaInterval(-1)"
            >
              Selecteaza
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-btn-dropdown>
    </q-btn-group>
    
    <div class="q-pa-sm text-bold">
      {{ formattedInterval }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, defineExpose } from 'vue'
import { useStore } from 'vuex'
import { useDateInterval } from '../composables/useDateInterval'
import { useDocumentInterval } from '../composables/useDocumentInterval'
import { useEventBus } from '../composables/useEventBus'

const props = defineProps({
  docs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['new-data'])

const store = useStore()
const eventBus = useEventBus()

// Template refs
const qDateProxy1 = ref(null)
const qDateProxy2 = ref(null)

// Composables
const { 
  datainceput, 
  datasfirsit, 
  formattedInterval,
  selectPredefinedInterval,
  getIntervalDates
} = useDateInterval()

const {
  listadocumente,
  fetchDocumentsInInterval,
  generateIntervalReport,
  openSingleDocumentReport
} = useDocumentInterval()

// Initialize listadocumente with props
listadocumente.value = props.docs

// Methods
const SchimbaInterval = async (intervalType, idgest) => {
  const gestiuneId = idgest || store.getters.gestiuneCurenta.id
  
  // Custom period
  if (intervalType === -1) {
    await DocumenteInInterval(gestiuneId)
    return
  }
  
  // Predefined intervals
  if (selectPredefinedInterval(intervalType)) {
    await DocumenteInInterval(gestiuneId)
  }
}

const DocumenteInInterval = async (idgest) => {
  try {
    const documents = await fetchDocumentsInInterval(
      datainceput.value,
      datasfirsit.value,
      idgest
    )
    emit('new-data', documents)
  } catch (error) {
    // Error already handled in composable
  }
}

const raportToateDocumentele = async (idgest, numegest) => {
  await generateIntervalReport(
    datainceput.value,
    datasfirsit.value,
    idgest,
    numegest
  )
}

const raportUnDocument = (id) => {
  openSingleDocumentReport(id)
}

const modificaUnDocument = (id) => {
  // Implementation for document modification
}

const test = () => {
  alert('Metoda test implementata in comp Bara Interval!')
}

const schimbaGestiunea = (id) => {
  SchimbaInterval(0, id)
}

// Lifecycle
onMounted(() => {
  eventBus.on('schimbgestiunea', schimbaGestiunea)
  SchimbaInterval(0)
})

onUnmounted(() => {
  eventBus.off('schimbgestiunea', schimbaGestiunea)
})

// Expose methods for parent component access
defineExpose({
  test,
  raportUnDocument,
  modificaUnDocument,
  raportToateDocumentele
})
</script>