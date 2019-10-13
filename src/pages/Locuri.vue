<template>
<q-page padding >
     <div class="q-pa-md" style="max-width:300px">
            <q-list bordered separator>

                    <q-slide-item clickable v-ripple v-for="l in locuri" :key="l.id" @left="onLeft" @right="onRight" left-color="red">
                        <template v-slot:left>
                            <div class="row items-center">
                                <q-icon left name="delete" /> Sterge!
                            </div>
                        </template>

                        <q-item>
                          <q-item-section>{{l.denumire}}</q-item-section>
                        </q-item>
                    </q-slide-item>

                    

    </q-list>
    <q-btn
            round
            color="primary"
            @click="showDialog"
            class="fixed"
            icon="add"
            style="right: 48px; bottom: 64px"
    >
            <q-popup-edit v-model="numenou" content-class="bg-accent text-white">
                <q-input dark color="white" v-model="numenou" dense autofocus counter @blur="adLoc">
                    <template v-slot:append>
                            <q-icon name="edit" />
                    </template>
                </q-input>
        </q-popup-edit>
    </q-btn>
     </div>
</q-page>
   
</template>
<script>
import axios from 'axios'

export default {
  data(){
      return {
         locuri:[],
         numenou:''
      }
  },
  created(){
    const token=this.$store.getters.token;

      axios.get(process.env.host+'locuri/toatelocurile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Raspuns la toate locurile',res);
           this.locuri=[...res.data.locuri]
        }
      ).catch(err =>{})
  },
  methods: {
    adLoc(){
       // alert('adaug loc')
       let locNou={
           id:0,
           denumire:this.numenou,
           stare:'ACTIV',
           prioritate:1
       }
       this.locuri.unshift(locNou);
       this.numenou='';
    },  
    onLeft ({ reset }) {
      this.$q.notify('Loc de dispunere sters cu succes')
      this.finalize(reset)
    },

    onRight ({ reset }) {
      this.$q.notify('Right action triggered. Resetting in 1 second.')
      this.finalize(reset)
    },

    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>