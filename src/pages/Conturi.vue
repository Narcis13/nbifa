<template>
    <q-page padding>
        <div class="q-pa-md q-gutter-sm">
           <q-splitter
                v-model="splitterModel"
       
             >
              <template v-slot:before>
                    <q-tree
                        :nodes="conturi"
                        node-key="id"
                        ref="tree"
                        @update:selected="getSelectedNode"
                        selected-color="primary"
                        :selected.sync="selected"
                    />
             </template>
             <template v-slot:after>
                   <h3 v-if="eFrunza">{{selected}}</h3>
             </template>
           </q-splitter>

        </div>
    </q-page>
</template>     

<script>

import axios from 'axios';


export default {
    data(){
        return {
            conturi:[],
            selected:null,
            nodSelectat:null,
            splitterModel:50
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
    },
    methods:{

        getSelectedNode(target){
            console.log('Element selectat', target,this.$refs.tree.getNodeByKey(target))
            this.nodSelectat= this.$refs.tree.getNodeByKey(target)
        }
    },
    computed:{
        eFrunza(){
            return this.nodSelectat&&!this.nodSelectat.children
        }

    }
}
</script>
