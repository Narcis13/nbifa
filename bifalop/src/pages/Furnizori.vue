<template>
    <div>
        <h6>Furnizori</h6>
    </div>
</template>

<script >
import { defineComponent ,reactive,inject,ref,computed} from 'vue'
import axios from 'axios'
import { date } from 'quasar'
import { useQuasar } from 'quasar'

export default defineComponent({
    setup () {
            const $q = useQuasar()
   
    const global=inject('global');
    const token=global.state.user.token;
    const compartiment=global.state.user.compartiment;
    let idcompartiment=compartiment=='SUPERVIZARE'? 0:global.state.user.nume_logare;
     console.log('Setup Furnizori',idcompartiment)

        function totiFurnizorii(){
                axios.get(process.env.host+`furnizori/toti/${idcompartiment}`,{headers:{"Authorization" : `Bearer ${token}`}}).then(

                    res => {
                    console.log('Raspuns la toate angajamentele',res.data);
                    
                
                    }
                ).catch(err =>{})
        }

        totiFurnizorii();

        return {}
    }
})
</script>

<style scoped>

</style>