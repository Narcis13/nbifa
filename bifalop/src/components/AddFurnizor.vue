<template>
<q-card style="width: 320px; max-width: 70vw;">
                     <q-card-section>
                          <div class="text-h6">Adauga furnizor</div>
                       </q-card-section>
                       <q-card-section>
                          <q-input  bottom-slots hint="Minim 3 caractere(cifre)" error-message="CUI INVALID!" v-model="cui" label="CUI" :error="!cuiValid" />
                          <q-input  v-model="numefurnizor" :rules="[ val => val.length >= 3 || 'Folositi mai mult de 3 caractere']" label="Furnizor"  />
                          <q-input  bottom-slots hint="24 caractere(cifre)" error-message="IBAN INVALID!" v-model="iban" label="IBAN" :error="!ibanValid" />
                          <q-input  v-model="mail" label="Adresa e-mail"  />
                          <q-input  v-model="localitate" label="Localitate"  />
                          <q-input  v-model="judet" label="Judet"  />
                       </q-card-section>

                        
                        <q-card-actions align="right" class="bg-white text-teal">
                          <q-btn flat label="Abandon" v-close-popup />
                          <q-space />
                          <q-btn flat :disable="!dateValide" label="Adauga" @click="furnizorNou" />
                        </q-card-actions>
</q-card>
</template>

<script>
import { defineComponent,ref,computed,inject } from 'vue'
import { date } from 'quasar'
import axios from 'axios'
import {uf,vercif,veriban} from '../logic/UtileFurnizori'

function suntDoarCifre(text){
   return /^\d+$/.test(text)
}

export default defineComponent({
    name:'AddFurnizor',
    setup (props, { emit }) {
       uf();
       const global=inject('global');
       const token=global.state.user.token;

        let cui = ref('')
        let iban= ref('')
        let mail=ref('')
        let judet=ref('')
        let localitate=ref('')
        let numefurnizor= ref('')

        //computed
               let cuiValid=computed(()=>{
                return cui.value.length>=3&&suntDoarCifre(cui.value)&&vercif(cui.value)
            })
            let ibanValid= computed(()=>{
                
                return veriban(iban.value)
            })
        return {
            cui,
            iban,
            numefurnizor,
            mail,
            localitate,
            judet,
            cuiValid,
            ibanValid,
            dateValide: computed(()=>cuiValid&&ibanValid&&numefurnizor.value.length>=3),
            furnizorNou(){
                axios.post(process.env.host+'furnizori/furnizornou',{
                        cui:cui.value,
                        iban:iban.value,
                        numefurnizor:numefurnizor.value,
                        mail:mail.value,
                        localitate:localitate.value,
                        judet:judet.value,
                        addedby:global.state.user.nume_logare
                    },{headers:{"Authorization" : `Bearer ${token}`}}).then(res =>{
                        console.log('A sosit rasunsul de la furnizor nou...')
                        emit('furnizor-adaugat',{id:res.data.id})
                    })
                    .catch(err=>{
                                    
                    })
            }
            
        }
    }
})
</script>

<style scoped>

</style>