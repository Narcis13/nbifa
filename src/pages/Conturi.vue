<template>
    <q-page padding>
        <div class="q-pa-md q-gutter-sm">
            <q-tree
                    :nodes="conturi"
                    node-key="id"
                    selected-color="primary"
                    :selected.sync="selected"
            />
        </div>
    </q-page>
</template>     

<script>

import axios from 'axios';


export default {
    data(){
        return {
            conturi:[],
            selected:''
        }

    },
    created(){

     const token=this.$store.getters.token;

      axios.get(process.env.host+'conturi/toate',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate conturile',res.data.conturi);
           this.conturi=[...res.data.conturi]
        }
      ).catch(err =>{})
    }
}
</script>
