<template>
   <div>
        <div class="row">
                  <q-select
                      filled
                      v-model="model"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      label="Denumire"
                      :options="options"
                      @filter="filterFn"
                      hint="Denumire material"
                    
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                  </q-select>  
               <q-input filled v-model="text" label="UM" hint="Unitatea masura" :dense="dense" />
               <q-input filled v-model="text" label="Cantitate" hint="Cantitate" :dense="dense" />
               <q-input filled v-model="text" label="Pret" hint="Pret unitar" :dense="dense" />
               <div class="column">
                    <div class="text-h6 q-mb-sm">Valoare</div>
                    <q-btn  icon="create"  color="secondary" flat label="Adauga" />
               </div>
        </div>
         
   </div>
    
</template>
<script>
export default {
     name:'Repere',
     props:[]            
}
</script>
