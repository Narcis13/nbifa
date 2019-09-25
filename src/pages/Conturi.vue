<template>
    <q-page padding>
        <div class="q-pa-md q-gutter-sm">
           <q-splitter
                v-model="splitterModel"
             style="height: 90vh;"
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
                 <div class="q-pa-md q-gutter-sm">
                   <h5 v-if="eFrunza">Cont sintetic: {{nodSelectat.label}}</h5>
                   <q-input v-if="eFrunza" standout v-model="analitic"  :prefix="nodSelectat.cont" >
                        <template v-slot:prepend>
                            <q-icon name="mail" ></q-icon>
                        </template>
                    </q-input>
                    <q-input
                            v-model="explicatii"
                            v-if="eFrunza"
                            label="Explicatii"
                            filled
                            type="textarea"
                    />
                    <q-btn v-if="eFrunza" outline rounded  color="primary"  label="Adauga analitic" @click="adaugAnalitic" ></q-btn>
                 </div>
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
            analitic:"",
            explicatii:"",
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

      //experiment
      
      axios.get(process.env.host+'conturi/toatetoate',{headers:{"Authorization" : `Bearer ${token}`}}).then(

        res => {
           console.log('Rspuns la toate conturile si analitice',res.data);
           
        }
      ).catch(err =>{})


    },
    methods:{

        getSelectedNode(target){
            this.analitic="";
            this.explicatii="";
            console.log('Element selectat', target,this.$refs.tree.getNodeByKey(target))
            this.nodSelectat= this.$refs.tree.getNodeByKey(target)
        },
        adaugAnalitic(){
            if(this.explicatii==""|| this.analitic==""){
               this.$q.notify({
                    color: 'secondary',
                    icon: 'delete',
                    position:'top',
                    message: `Nu sunt acceptate cimpuri vide!`
                  })
            }
            else{
                //aici cod pentru introducerea efectiva
                          const token=this.$store.getters.token;
                          var that = this;

                        axios.post(process.env.host+'conturi/analiticnou',{
                        "cont":this.analitic,
                        "idsintetic":this.nodSelectat.id,
                        "explicatii":this.explicatii,
                        "contsintetic":this.nodSelectat.cont,
                        "contcomplet":this.nodSelectat.cont+this.analitic,
                        "nivel":this.nodSelectat.nivel+1,


                        "stare":"activ"
                    },{headers:{"Authorization" : `Bearer ${token}`}}).then(
                            res => {
                            console.log('raspuns insert analitic',res);
                                this.$q.notify({
                                message:`Cont analitic adaugat cu succes!`,
                                timeout:1500,
                                position:'top',
                                color:'positive'
                    });
                            //prelucrari view client side
                            if (this.nodSelectat.children){
                            this.nodSelectat.children.push({id:res.data.id,cont:this.analitic,sintetic:this.nodSelectat.cont,isLeaf:false,label:this.nodSelectat.cont+this.analitic+" "+this.explicatii})
                            }
                            else
                            {
                                this.nodSelectat['children']=[];
                                 this.nodSelectat.children.push({id:res.data.id,cont:this.analitic,sintetic:this.nodSelectat.cont,isLeaf:false,label:this.nodSelectat.cont+this.analitic+" "+this.explicatii})
                            }
                            this.nodSelectat=null;


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

            }
        }
    },
    computed:{
        eFrunza(){
            let contineFrunze=false;
            if(this.nodSelectat){

                if(this.nodSelectat.children){
                        this.nodSelectat.children.map((item)=>{
                            if(!item.children) contineFrunze=true;
                        })
                        if(this.nodSelectat.children.length==0||contineFrunze)
                          return true
                        else
                          return false  
                }
                else {
                    if(this.nodSelectat.nivel<3)
                    return true
                    else
                    return false
                    };

            }
            else
            return false;
           // return this.nodSelectat&&(this.nodSelectat.children&&(this.nodSelectat.children.length==0))||this.nodSelectat.isLeaf
        }

    }
}
</script>
