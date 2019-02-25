const knex =require('../../db.js');


module.exports.toate = (req, res, next) => {
    console.log('sunt in controllerul categorie actiunea toate....')
    /*
    knex.select(['gestiuni.id', 'gestiuni.denumire', 'gestiuni.r_presedinte', 'gestiuni.i_presedinte' ,'utilizatori.username'])
.from('gestiuni')
.innerJoin('utilizatori','utilizatori.id','gestiuni.userid')
    */ 
   knex.select(['categorii.id', {gestiune:'gestiuni.denumire'}, 'categorii.denumire','categorii.idgestiune' ,'categorii.cont', 'categorii.contcheltuiala' ,'categorii.tipmaterial'])
   .from('categorii')
   .innerJoin('gestiuni','gestiuni.id','categorii.idgestiune').orderBy('gestiuni.denumire').then((rows)=>{
      return res.status(200).json({
       message: "Toate CATEGORIILE",
       categorii:rows
     });
    }).catch(err =>{})
}