import {reactive} from 'vue'

const state = reactive({
    user:{
        autentificat:false,
        nume:'',
        compartiment:null,
        rol:null,
        token:null,
        idcompartiment:0,
        idutilizator:0
    }
})

const actions = {
     autentificare(user){
         console.log('Autentificare: ',user)

         state.user.autentificat=true;
         state.user.token=user.token;
         state.user.nume=user.utilizator[0].obs;
         state.user.rol=user.utilizator[0].rol;
         state.user.compartiment=user.utilizator[0].denumire;
         state.user.idcompartiment=user.utilizator[0].idcompartiment;
         state.user.idutilizator=user.utilizator[0].id;
     },
     deconectare(){
        state.user.autentificat=false
     }
}

export default {
    state,
    actions
}