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
    knex.select(['paap.id', 'obiecte_achizitie.obiectachizitie_text','coduricpv.CodCPV','paap.cantitate','paap.valoare','tipproceduri.procedura','paap.responsabil','paap.artbug','compartimente.denumire'])
    .from('paap')
    .innerJoin('obiecte_achizitie','obiecte_achizitie.id','paap.id_obiect_achizitie')
    .innerJoin('coduricpv','paap.id_cod_cpv','coduricpv.IDCod')
    .innerJoin('tipproceduri','paap.id_procedura','tipproceduri.id')
    .innerJoin('compartimente','paap.id_compartiment','compartimente.id')
    .where('paap.id_compartiment',op,parseInt(req.params.idcomp))
    .andWhere('paap.anplan',parseInt(req.params.an))
    .orderBy('paap.artbug').then((rows)=>{
       return res.status(200).json({
        message: "Intregul PAAP",
        paap:rows
      });
     }).catch(err =>{})

}