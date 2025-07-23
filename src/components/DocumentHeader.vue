<template>
  <div class="row justify-around items-start content-start">
    <q-select 
      @input="$emit('change-tip-material', $event)"
      outlined 
      v-model="tipmaterial" 
      :options="tipurirepere" 
      label="Tip material" 
    />   

    <q-select 
      outlined 
      use-input  
      input-debounce="0" 
      v-model="tipdocument" 
      :options="tipuridocumente" 
      @input="$emit('tip-document-selectat', $event)" 
      label="Tip document" 
      style="min-width:200px;"
    />

    <q-input 
      outlined 
      readonly 
      v-model="datadoc"   
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date  
              mask="DD/MM/YYYY" 
              v-model="datadoc" 
              @input="() => $refs.qDateProxy.hide()" 
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-input 
      outlined 
      v-model="nrdoc" 
      label="Nr. document" 
      style="max-width:140px;" 
      :rules="[
        val => val !== null && val !== '' || 'Cimpul nu poate fi vid!'
      ]"
    />
  </div>
</template>

<script>
export default {
  name: 'DocumentHeader',
  props: {
    tipmaterial: {
      type: Object,
      required: true
    },
    tipurirepere: {
      type: Array,
      required: true
    },
    tipdocument: {
      type: Object,
      required: true
    },
    tipuridocumente: {
      type: Array,
      required: true
    },
    datadoc: {
      type: String,
      required: true
    },
    nrdoc: {
      type: String,
      required: true
    }
  },
  emits: ['change-tip-material', 'tip-document-selectat']
}
</script>