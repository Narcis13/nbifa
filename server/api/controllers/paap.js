const { innerJoin } = require('../../dbaky.js');
const knex =require('../../dbaky.js');

module.exports.tot = (req, res, next) => {
    console.log('sunt in controllerul PAAP actiunea tot....',req.params.an,typeof req.params.an)
    let op="=";
    if(req.params.idcomp==="Niciunul"){
      return res.status(401).json({
        message: "Cimpuri vide!"
      })
    } else if(req.params.idcomp=="0") op=">" 
    knex.select(['paap.id','paap.anplan','paap.id_procedura','paap.id_compartiment','paap.id_cod_cpv','paap.to', 'paap.id_obiect_achizitie','obiecte_achizitie.obiectachizitie_text','coduricpv.CodCPV','paap.cantitate','paap.valoare','tipproceduri.procedura','paap.responsabil','paap.artbug','compartimente.denumire'])
    .from('paap')
    .innerJoin('obiecte_achizitie','obiecte_achizitie.id','paap.id_obiect_achizitie')
    .innerJoin('coduricpv','paap.id_cod_cpv','coduricpv.IDCod')
    .innerJoin('tipproceduri','paap.id_procedura','tipproceduri.id')
    .innerJoin('compartimente','paap.id_compartiment','compartimente.id')
    .where('paap.id_compartiment',op,parseInt(req.params.idcomp))
    .andWhere('paap.anplan',parseInt(req.params.an))
    .andWhere('paap.stare','activ')
    .orderBy('paap.artbug').then((rows)=>{
       return res.status(200).json({
        message: "Intregul PAAP",
        paap:rows
      });
     }).catch(err =>{})

}


module.exports.cloneaza_pozitii = (req,res,next) => {
 
let tranzactii= req.body.tranzactii;
let pozitii=[];
let iduri=[];

tranzactii.map(t => {
  iduri.push(t.id);
  pozitii.push({
    id_procedura:t.id_procedura,
    id_compartiment:t.id_compartiment,
    id_cod_cpv:t.id_cod_cpv,
    from:t.id,
    id_obiect_achizitie:t.id_obiect_achizitie,
    cantitate:t.cantitate,
    valoare:t.valoare,
    responsabil:t.responsabil,
    artbug:t.artbug,
    sursa_finantare:'venituri proprii',
    luna_inceput:'ianuarie',
    luna_sfirsit:'decembrie',
    mod_derulare:'online',
    stare:'activ',
    anplan:t.anplan+1,
    data_creere:knex.fn.now(),
    data_modificare:knex.fn.now()
  })
})


console.log('Sunt in controllerul paap actiunea cloneaza pozitii',iduri);
knex('paap').insert(pozitii).then((d)=>{
   // aici updatez to...
   knex('paap').whereIn('id',iduri).update({
         
    data_modificare:knex.fn.now(),
    to:1
  })
  .then(()=>{
    return res.status(200).json({
      message: "Tranzactii adaugate"
    });
  
  }).catch(err =>{})

 }).catch(err =>{ console.log(err)})


  
}

module.exports.toate_procedurile = (req, res, next) => {

  knex('tipproceduri').then((rows)=>{
    return res.status(200).json({
     message: "Toate procedurile",
     proceduri:rows
   });
  }).catch(err =>{})

}

module.exports.toate_codurilecpv = (req, res, next) => {

  knex('coduricpv').then((rows)=>{
    return res.status(200).json({
     message: "Toate codurile CPV",
     coduri:rows
   });
  }).catch(err =>{})

}


module.exports.update = (req,res,next) => {
  const cimp=Object.keys(req.body)[0];
  const valoare = req.body[cimp];
  console.log('sunt in controlerul paap actiunea update...',cimp,valoare.valoare.value);

 knex('paap').whereIn('id',req.body.iduri).update({
         
    data_modificare:knex.fn.now(),
    [cimp]:valoare.valoare.value
  })
  .then(()=>{
    return res.status(200).json({
      message: "Actualizare reusita"
    });
  
  }).catch(err =>{})


}

module.exports.update_atomic = (req,res,next) => {
  const cimp=Object.keys(req.body)[0];
  const valoare = req.body[cimp];
  console.log('sunt in controlerul paap actiunea update_atomic',cimp,valoare);
  knex('paap').where({
    id: req.params.idpaap
  }).update({
         
    data_modificare:knex.fn.now(),
    [cimp]:valoare
  })
  .then(()=>{
    return res.status(200).json({
      message: "Actualizare reusita"
    });
  
  }).catch(err =>{})



}

module.exports.update_obiect_aky = (req,res,next) => {
 
  const valoare = req.body.text;
  console.log('sunt in controlerul paap actiunea update_obiect_aky',req.params.idpaap,valoare);
 knex('obiecte_achizitie').where({
    id: req.params.idpaap
  }).update({
         
 
    obiectachizitie_text:valoare
  })
  .then(()=>{
    return res.status(200).json({
      message: "Actualizare reusita"
    });
  
  }).catch(err =>{})




}

module.exports.invalideazapozitieplan = (req,res,next) => {
  
  const iduri = req.body.iduri;
  console.log('sunt in controlerul paap actiunea sterge pozitie plan',iduri);
  knex('paap').whereIn('id',iduri).update({
         
    data_modificare:knex.fn.now(),
    stare:'inactiv'
  })
  .then(()=>{
    return res.status(200).json({
      message: "Actualizare reusita"
    });
  
  }).catch(err =>{})



}