const knex =require('../../db.js');


module.exports.toate = (req, res, next) => {
    

   knex('conturi').where('id', '>', 1).orderBy('cont').then((rows)=>{
    console.log('sunt in controllerul cont actiunea toate....')
     var toate=[],nivel1=[],nivel2=[],nivel3=[];
     rows.map((item)=>{
         if (item.nivel==0) nivel1.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic,children:[],isLeaf:false})
         if (item.nivel==1) nivel2.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic,children:[],isLeaf:false})
         if (item.nivel==2) nivel3.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic,isLeaf:true})
     })

     nivel3.map((item)=>{
       nivel2.map(it=>{
         if(it.cont==item.sintetic) it.children.push(item)
       })
     })

     nivel2.map((item)=>{
      nivel1.map(it=>{
        if(it.cont==item.sintetic) it.children.push(item)
      })
    })
      return res.status(200).json({
       message: "Toate CONTURILE",
       conturi:nivel1
     });
    }).catch(err =>{})
}

module.exports.toatetoate = (req, res, next) => {
    

  knex.select(['conturi.id','conturi.denumire','conturi.sintetic',{analitic:'analitice.cont'},'conturi.cont','analitice.explicatii']).from('conturi').leftJoin('analitice', 'conturi.id', 'analitice.idsintetic').where('conturi.id', '>', 1).orderBy('conturi.cont').then((rows)=>{
   
     return res.status(200).json({
      message: "Toate CONTURILE ciu analitice",
      conturi:rows
    });
   }).catch(err =>{})
}



module.exports.analiticnou = (req,res,next) =>{

  console.log('sunt in controllerul conturi  actiunea analitic nou',req.body)




        knex('analitice').insert({
          cont:req.body.cont,
          idsintetic:req.body.idsintetic,
          explicatii:req.body.explicatii,
          created_at:new Date().toISOString(),
          updated_at:new Date().toISOString(),
          stare:req.body.stare
          
      }).then((d)=>{
        
            knex('conturi').insert({
              cont:req.body.contcomplet,
              tip:"A",
              denumire:req.body.explicatii,
              created_at:new Date().toISOString(),
              updated_at:new Date().toISOString(),
              sintetic:req.body.contsintetic,
              nivel:3
              
             }).then((d)=>{
                console.log('analitic adaugat ',d)
                return res.status(200).json({
                  message: "Analitic adaugat!",
                  id:d[0]
                }).catch(err =>{})
            }).catch(err =>{})
       
  
      }).catch(err =>{})
                                                

}