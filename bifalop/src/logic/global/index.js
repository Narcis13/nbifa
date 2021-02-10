import {reactive} from 'vue'

const state = reactive({
    user:{
        autentificat:false,
        nume:'',
        compartiment:null,
        rol:null,
        token:null
    }
})

const actions = {
     autentificare(user,parola){
         console.log('Autentificare: '+user+" "+parola)
         state.user.autentificat=true
     },
     deconectare(){
        state.user.autentificat=false
     }
}

export default {
    state,
    actions
}