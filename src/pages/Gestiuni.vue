<template>
    <q-page padding class="row items-start">
          <q-card v-for="g in gestiuni" inline style="width: 200px" class="bg-secondary text-white q-ma-sm" :key="g.denumire">
            <q-card-section>
                <div class="text-h6">{{g.denumire}}</div>
                <div class="text-subtitle2">Utilizator implicit:</div>
            </q-card-section>

            <q-card-section>
                {{ lorem }}
            </q-card-section>

            <q-separator dark />

            <q-card-actions>
                <q-btn flat>Detalii</q-btn>
                <q-btn flat>Sterge</q-btn>
            </q-card-actions>

          </q-card>
    </q-page>
</template>
<script>
import axios from 'axios'
import { uid, filter } from 'quasar'

function parseUsers () {
  return listaUtilizatori.map(user => {
    return {
      label: user.username,
      id:user.id,
      value: user.username
    }
  })
}

export default {
  data () {
    return {
      stars: 3,
      numegestiune:'',
      terms:'',
      r_p:'',
      r_m1:'',
      r_m2:'',
      r_m3:'',
      i_p:'',
      i_m1:'',
      i_m2:'',
      i_m3:'',
      userId:0,
      gestiuni:[],
      listaUtilizatori:[],
      opened:false,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    }
  },
  created(){
     //console.log('Se creeaza Utilizatorii....')
     const token=this.$store.getters.token;

      axios.get(process.env.host+'gest/toategestiunile',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate gestiunile',this.gestiuni);
           this.gestiuni=[...res.data.gestiuni]
        }
      ).catch(err =>{})

     axios.get(process.env.host+'user/allusers',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
          
           this.listaUtilizatori=res.data.utilizatori.map(user => {
                                                            return {
                                                              label: user.username,
                                                              id:user.id,
                                                              value: user.username
                                                            }
                                                          })
        }
      ).catch(err =>{})
  },
  methods:{
    gestiuneNoua(){
     // alert('Gestiune Noua')
      const numegestiune=this.numegestiune;
      const token=this.$store.getters.token;
      var that = this;
      axios.post(process.env.host+'gest/gestiunenoua',{
         "denumire":this.numegestiune,
         "userid":this.userId,
         "r_presedinte":this.r_p,
         "r_membru1":this.r_m1,
         "r_membru2":this.r_m2,
         "r_membru3":this.r_m3,
         "i_presedinte":this.i_p,
         "i_membru1":this.i_m1,
         "i_membru2":this.i_m2,
         "i_membru3":this.i_m3,
         "stare":"activ"
      },{headers:{"Authorization" : `Bearer ${token}`}}).then(
            res => {
                 this.$q.notify({
                 message:`Gestiunea ${numegestiune} a fost adaugata cu succes!`,
                 timeout:1500,
                 position:'top',
                 color:'positive'
      });
        that.gestiuni.unshift({
          "id":res.data.id,
          "denumire":that.numegestiune,
          "userid":that.userId,
          "r_presedinte":that.r_p,
          "r_membru1":that.r_m1,
          "r_membru2":that.r_m2,
          "r_membru3":that.r_m3,
          "i_presedinte":that.i_p,
          "i_membru1":that.i_m1,
          "i_membru2":that.i_m2,
          "i_membru3":that.i_m3,
        });

          that.numegestiune='';
          that.userId=0;
          that.r_p='';
          that.r_m1='';
          that.r_m2='';
          that.r_m3='';
          that.i_p='';
          that.i_m1='';
          that.i_m2='';
          that.i_m3='';

      that.opened=false;
            }
     ).catch(err=>{
       console.log('Eroare.............',err.response.data.message)
       this.$q.notify({
                    color: 'negative',
                    timeout:1500,
                    position:'top',
                    icon: 'delete',
                    message: `ATENTIE! ${err.response.data.message}`
                  })
     });
    },
    selected (item) {
    //  this.$q.notify(`id selectat "${item.id}"`)
         this.userId=item.id;
    },
    search(terms, done){
      //console.log('terms ',terms, this.listaUtilizatori,filter(terms, {field: 'username', list: this.listaUtilizatori}));
   
        done(filter(terms, {field: 'value', list: this.listaUtilizatori}))
       
    }
  }
}
</script>
<style>
 
</style>
