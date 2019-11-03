

const knex =require('../../db.js');
/*const User = require("../models/user");*/



module.exports.toate = (req, res, next) => {
 console.log('sunt in controllerul materiale actiunea toate....')
 knex.column(['materiale.id','materiale.denumire','materiale.um','materiale.pretpredefinit',{gestiune:'gestiuni.denumire'},{user:'utilizatori.name'},'materiale.datacreere','materiale.datamodificare'])
 .select().from('materiale')
 .innerJoin('gestiuni','materiale.idgestiune','gestiuni.id')
 .innerJoin('utilizatori','utilizatori.id','materiale.iduser').then((rows)=>{
   return res.status(200).json({
    message: "Toate materialele",
    materiale:rows
  });
 }).catch(err =>{})
 
};

module.exports.materialnou = (req,res,next) =>{
  console.log('sunt in comntrolerul matriale actiunea material nou',req.body)
  if(req.body.denumire===""){
    return res.status(401).json({
      message: "Cimpuri vide!"
    })
  }

  knex('materiale').insert({
    denumire:req.body.denumire,
    um:req.body.um,
    pretpredefinit:req.body.pretpredefinit,
    idgestiune:req.body.idgestiune,
    iduser:req.body.iduser,
    stare:req.body.stare,
        
    datacreere:knex.fn.now(),//new Date().toISOString(),
    datamodificare:knex.fn.now()//new Date().toISOString()

    
}).then((d)=>{
  console.log('Material adaugat',d)
  return res.status(200).json({
    message: "Material adaugat!",
    id:d[0]
  })
}).catch(err =>{ console.log(err)})
};