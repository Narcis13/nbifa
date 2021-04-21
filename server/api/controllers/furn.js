const knex =require('../../dbaky.js');

module.exports.toti = (req,res,next)=> {

  console.log('Toti furnizorii compartimentului...',req.params.idcomp)
  return res.status(200).json({
    message: "toti furnizorii"
  });

}