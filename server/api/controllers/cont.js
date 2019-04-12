const knex =require('../../db.js');


module.exports.toate = (req, res, next) => {
    console.log('sunt in controllerul cont actiunea toate....')

   /*knex.select(['categorii.id', {gestiune:'gestiuni.denumire'}, 'categorii.denumire','categorii.idgestiune' ,'categorii.cont', 'categorii.contcheltuiala' ,'categorii.tipmaterial'])
   .from('categorii')
   .innerJoin('gestiuni','gestiuni.id','categorii.idgestiune').where({"categorii.stare":"activ"}).orderBy('gestiuni.denumire').then((rows)=>{
      return res.status(200).json({
       message: "Toate CATEGORIILE",
       categorii:rows
     });
    }).catch(err =>{})*/
}