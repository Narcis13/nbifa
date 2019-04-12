const knex =require('../../db.js');


module.exports.toate = (req, res, next) => {
    

   knex('conturi').where('id', '>', 1).orderBy('cont').then((rows)=>{
    console.log('sunt in controllerul cont actiunea toate....')
     var toate=[],nivel1=[],nivel2=[],nivel3=[];
     rows.map((item)=>{
         if (item.nivel==0) nivel1.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic,children:[]})
         if (item.nivel==1) nivel2.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic,children:[]})
         if (item.nivel==2) nivel3.push({id:item.id,cont:item.cont,label:item.cont+" "+item.denumire,sintetic:item.sintetic})
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