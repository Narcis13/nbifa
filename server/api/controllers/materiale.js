

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