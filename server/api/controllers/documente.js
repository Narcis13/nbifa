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
     "idgestiune":req.body.idgestiune,   
    datacreere:knex.fn.now(),//new Date().toISOString(),
    datamodificare:knex.fn.now()//new Date().toISOString()

    
}).then((d)=>{
 // console.log('Material adaugat',d)
  return res.status(200).json({
    message: "Antet document adaugat",
    id:d[0],
   // datacreere:knex.fn.now(),
   // datamodificare:knex.fn.now()
  })
}).catch(err =>{ console.log(err)})
}

module.exports.documenteinterval = (req,res,next) => {
  console.log("sunt in controllerul documente actiunea documenteinterval",req.body);
  
  knex.select(['operatiuni.id', 'operatiuni.idtipoperatiuni', 'operatiuni.tipoperatiune','operatiuni.data' ,'operatiuni.nrdoc', 'operatiuni.stare','operatiuni.datacreere','operatiuni.datamodificare'])
   .from('operatiuni')
   .innerJoin('tranzactii','operatiuni.id','tranzactii.idAntet').sum('tranzactii.debit as debit').sum('tranzactii.credit as credit')
   .whereRaw('operatiuni.stare=? and operatiuni.data >= ? and operatiuni.data <= ? and operatiuni.idgestiune = ?',['ACTIV',req.body.inceput,req.body.sfirsit,req.body.idgestiune])
   .groupBy('tranzactii.idAntet')
   .then((rows)=>{
    
        return res.status(200).json({
               message: "Documente in interval",
               documente:rows
             });
  }).catch(err =>{console.log(err)})
 

}


module.exports.invalidez_document = (req, res, next) => {
  console.log('sunt in controllerul documenete actiunea INVALIDEZ....',req.params.iddoc)
  knex('operatiuni').where({
    id: req.params.iddoc
  }).update({
         
    datamodificare:knex.fn.now(),
    stare:"inactiv"
  })
  .then(()=>{
    return res.status(200).json({
      message: "Document inactivat!"
    });
  
  }).catch(err =>{})
};

module.exports.tranzactienoua = (req,res,next) =>{
  console.log("sunt in controllerul documente actiunea tranzactienoua",req.body);
  let linii=[];
  req.body.tranzactii.map(t=>{

    if(t.tip=="t"){
       //transfer
       linii.push({
        'idAntet' :t.idAntet,
        'id_categ' :t.id_categ_iesire,
        'id_reper' :t.id_reper,
        'id_gestiune':t.id_gestiune,
        'id_locdispunere' :t.id_lociesire,
        'um':t.um,
        'cantitate_debit' :0,
        'cantitate_credit' :t.cantitate,
        'pret' :t.pret,
        'debit' :0,
        'credit' :t.valoare,
        'stare_material' :t.stare_material_iesire,
        'stare' :'ACTIV',
        'datacreere':knex.fn.now(),
        'datamodificare' :knex.fn.now()
      })   

      linii.push({
        'idAntet' :t.idAntet,
        'id_categ' :t.id_categ_intrare,
        'id_reper' :t.id_reper,
        'id_gestiune':t.id_gestiune,
        'id_locdispunere' :t.id_locintrare,
        'um':t.um,
        'cantitate_debit' :t.cantitate,
        'cantitate_credit' :0,
        'pret' :t.pret,
        'debit' :t.valoare,
        'credit' :0,
        'stare_material' :t.stare_material_intrare,
        'stare' :'ACTIV',
        'datacreere':knex.fn.now(),
        'datamodificare' :knex.fn.now()
      })
      
    }
    else
    {
     //intrare sau iesire
     if(t.tip=="i")
        linii.push({
          'idAntet' :t.idAntet,
          'id_categ' :t.id_categ_intrare,
          'id_reper' :t.id_reper,
          'id_gestiune':t.id_gestiune,
          'id_locdispunere' :t.id_locintrare,
          'um':t.um,
          'cantitate_debit' :t.cantitate,
          'cantitate_credit' :0,
          'pret' :t.pret,
          'debit' :t.valoare,
          'credit' :0,
          'stare_material' :t.stare_material_intrare,
          'stare' :'ACTIV',
          'datacreere':knex.fn.now(),
          'datamodificare' :knex.fn.now()
        })
     else
          linii.push({
            'idAntet' :t.idAntet,
            'id_categ' :t.id_categ_iesire,
            'id_reper' :t.id_reper,
            'id_gestiune':t.id_gestiune,
            'id_locdispunere' :t.id_lociesire,
            'um':t.um,
            'cantitate_debit' :0,
            'cantitate_credit' :t.cantitate,
            'pret' :t.pret,
            'debit' :0,
            'credit' :t.valoare,
            'stare_material' :t.stare_material_iesire,
            'stare' :'ACTIV',
            'datacreere':knex.fn.now(),
            'datamodificare' :knex.fn.now()
          })     
    }


  })
console.log('Ma pregatesc sa inserez linii',linii)
  knex('tranzactii').insert(linii).then((d)=>{
 // console.log('Material adaugat',d)
  return res.status(200).json({
    message: "Tranzactii adaugate"
  })
}).catch(err =>{ console.log(err)})

}

