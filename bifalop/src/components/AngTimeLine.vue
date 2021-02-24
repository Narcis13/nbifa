<template>
      <q-chip dense color="primary" text-color="white" icon="event">
            Add to calendar
      </q-chip>
</template>

<script>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
    name:'AngTimeLine',
    setup(){
        console.log('Initializare AngTimeLine')
            onMounted(() => {
      console.log('mounted!')
    })
    }
})
</script>