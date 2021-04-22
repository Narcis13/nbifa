const knex =require('../../dbaky.js');

module.exports.toti = (req,res,next)=> {

  console.log('Toti furnizorii compartimentului...',req.params.idcomp)

  knex('furnizori').where('addedby',req.params.idcomp).orderBy('id', 'desc').then(r=>{

    return res.status(200).json({
      message: "toti furnizorii",
      furnizori:r
    });
  }).catch(err =>{console.log(err)})


}