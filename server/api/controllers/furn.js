const knex =require('../../dbaky.js');
const moment = require('moment');
module.exports.toti = (req,res,next)=> {

  console.log('Toti furnizorii compartimentului...',req.params.idcomp)

  knex('furnizori').where('addedby',req.params.idcomp).orderBy('id', 'desc').then(r=>{

    return res.status(200).json({
      message: "toti furnizorii",
      furnizori:r
    });
  }).catch(err =>{console.log(err)})


}

module.exports.furnizor_nou=(req,res,next)=>{
  console.log('FURNIZOR NOU...',req.body)
  knex('furnizori').insert({
    denumire:req.body.numefurnizor,
    codfiscal:req.body.cui,
    iban:req.body.iban,
    email:req.body.mail,
    localitate:req.body.localitate,
    judet:req.body.judet,
    addedby:req.body.addedby,
    dindata:moment().format('YYYY-MM-DD'),
    stare:'activ',
    idc:8,
  
  
}).then((d)=>{
  return res.status(200).json({
    message: "Furnizor adaugat!",
    id:d[0]

  })
}).catch(err =>{ console.log(err)})
  

}