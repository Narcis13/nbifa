const knex =require('../../db.js');
/*const User = require("../models/user");*/

module.exports.tipuridocumente = (req, res, next) => {
    console.log('sunt in controllerul documente actiunea tipuridocumente....')
    knex('tipuridocumente').orderBy(['prioritate']).then((rows)=>{
        return res.status(200).json({
         message: "Toate tipurile de documenete",
         tipuridocs:rows
       });
      }).catch(err =>{})

}

module.exports.documentnou = (req,res,next) => {

  console.log("sunt in controllerul documente actiunea document nou",req.body);

  knex('operatiuni').insert({

    "idtipoperatiuni":req.body.idtipoperatiuni,
    "tipoperatiune":req.body.tipoperatiune,
    "data":req.body.data,
    "nrdoc":req.body.nrdoc,
    "stare":"ACTIV",
        
    datacreere:knex.fn.now(),//new Date().toISOString(),
    datamodificare:knex.fn.now()//new Date().toISOString()

    
}).then((d)=>{
 // console.log('Material adaugat',d)
  return res.status(200).json({
    message: "Antet document adaugat",
    id:d[0]
  })
}).catch(err =>{ console.log(err)})
}