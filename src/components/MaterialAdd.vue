<template>
     <q-btn icon="add_box" color="secondary" flat label="Adauga" class="q-mr-sm">
           <q-menu>
                    
                    <div class="column no-wrap q-pa-md">
                        <div class="text-h6 q-mb-md">Settings</div>
                        <q-toggle v-model="mobileData" label="Use Mobile Data" />
                        <q-toggle v-model="bluetooth" label="Bluetooth" />
                        <q-btn
                            color="primary"
                            @click="adauga"
                            label="Salveaza!"
                            push
                            size="sm"
                            v-close-popup
                        />
                    </div>
             
                  
              </q-menu>
     
     </q-btn>

</template>

<script>

export default {
    name:'MaterialAdd',
    props: [],
    data: function () {
        return {
           
        }
    },
    methods:{
        adauga(){
               this.$q.notify('Material adaugat cu succes')
        }
    }
}

</script>