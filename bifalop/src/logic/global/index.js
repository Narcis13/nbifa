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
     autentificare(){
         state.user.autentificat=true
     }
}

export default {
    state,
    actions
}