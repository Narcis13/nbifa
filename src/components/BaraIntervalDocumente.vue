<template>
    <div class="row q-pa-md">
    <q-btn-group rounded>
      <q-btn rounded color="primary" label="Luna aceasta" @click="SchimbaInterval(0)"></q-btn>

      <q-btn rounded color="primary" label="Luna trecuta" @click="SchimbaInterval(1)"></q-btn>
      
      <q-btn rounded color="primary" label="Anul acesta" @click="SchimbaInterval(2)"></q-btn>

      <q-btn-dropdown  rounded color="primary" label="Alta perioada" >
        <!-- dropdown content goes here -->
    <q-card >
      <q-card-section>
          <q-input filled label="De la" v-model="datainceput" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                  <q-date v-model="datainceput" @input="() => $refs.qDateProxy1.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input filled label="La" v-model="datasfirsit" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                  <q-date v-model="datasfirsit" @input="() => $refs.qDateProxy2.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
      </q-card-section>

      <q-card-actions vertical>
        <q-btn flat v-close-popup>Selecteaza</q-btn>

      </q-card-actions>
    </q-card>
      </q-btn-dropdown>
    </q-btn-group>
    <div class="q-pa-sm text-bold">
      {{datainceput}} : {{datasfirsit}}
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
    name:'BaraIntervalDocumente',
    data(){
        return {
            datainceput: '2019/02/01',
            datasfirsit:'2019/02/01'
        }
    },
    created(){

     this.SchimbaInterval(0)     
    },
    methods:{

      SchimbaInterval(p){
         var azi = new Date(); 
        // 0 -> luna curenta  
        if(p==0) {
                var firstDay =  
                    new Date(azi.getFullYear(), azi.getMonth(), 1); 
                      
                var lastDay =  
                   new Date(azi.getFullYear(), azi.getMonth() + 1, 0); 
        }

         // 1 -> luna trecuta
        if(p==1){
                var firstDay =  
                    new Date(azi.getFullYear(), azi.getMonth()-1, 1); 
                      
                var lastDay =  
                   new Date(azi.getFullYear(), azi.getMonth(), 0); 

        }

        //2 -> anul acesta
        if(p==2){

               var firstDay =  
                    new Date(azi.getFullYear(), 0, 1); 
                      
                var lastDay =   azi; 
        }

       this.datainceput=date.formatDate(firstDay, 'YYYY/MM/DD');
       this.datasfirsit=date.formatDate(lastDay, 'YYYY/MM/DD');    

      }
    }
}
</script>
