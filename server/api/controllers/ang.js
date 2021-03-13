const knex =require('../../dbaky.js');
const moment = require('moment');
const primaziaanului=moment().startOf('year').format('YYYY-MM-DD');

module.exports.toate = (req,res,next) => {
  console.log('Toate angajamentele',moment().startOf('year').format('YYYY-MM-DD'))

let sql=`SELECT statistici.nr,ang.id,antang.nrdoc,antang.viza,ang.idAntet, antang.dataang,antang.detalii,ang.suma,ang.codCap,ang.numecap,ang.artbug,c.denumire compartiment,c.id idcompartiment,antang.stare FROM adata.angajamente ang 
left join adata.anteteangajamente antang on antang.id=ang.idAntet
inner join compartimente c on c.id=antang.compID
inner join (select idAntet, count(idAntet) as nr from adata.angajamente group by idAntet ) statistici on statistici.idAntet=ang.idAntet
where dataang>'${primaziaanului}' and antang.stare='activ' and  c.id=?

order by ang.id desc`;

knex.raw(sql,[req.params.idcomp]).then(
  r=>{
   // console.log("Raspuns de la query stoc pret mediu",r)
   return res.status(200).json({
    message: "Toate angajamentele",
    angajamente:r
   
  });
  }
).catch(err =>{console.log(err)})


    
  
  
 }

 module.exports.categorii_bugetare = (req,res,next) => {
   console.log('sunt in categorii bugetare...',req.params.idcomp)

let sql=`SELECT c.id,c.denumire,c.buget,c.codCap,c.numecap,c.artbug, bug.total as crediteaprobate,@crediteangajate:=ifnull((SELECT sum(suma)  FROM adata.angajamente ang where data_ang>'${primaziaanului}' and ang.codCap = c.codCap and ang.artbug=c.artbug ),0) as crediteangajate,(bug.total-@crediteangajate) as disponibil  FROM adata.caategorii c
inner join adata.artbugete bug on bug.id=c.buget
where c.idcomp=?;`

knex.raw(sql,[req.params.idcomp]).then(
  r=>{
   // console.log("Raspuns de la query stoc pret mediu",r)
   return res.status(200).json({
    message: "Categoriile compartimentului",
    categorii:r
   
  });
  }
).catch(err =>{console.log(err)})

 }

 module.exports.angajament_nou = (req,res,next)=>{
   console.log('Controller angajamente actiunea angnou..',req.body)
   let sql='SELECT nrdoc FROM anteteangajamente ORDER BY id DESC LIMIT 1';
   let nrdoc=1;
   knex.raw(sql,[]).then(
    r=>{
     // console.log("Raspuns de la ang nrdoc",r[0][0].nrdoc)
     nrdoc=parseInt(r[0][0].nrdoc)+1
    }
  ).catch(err =>{console.log(err)})

   knex('anteteangajamente').insert({

    dataprop:req.body.dataprop,
    tip:1,
    detalii:req.body.detalii,
    dataang:req.body.dataang,
    compID:req.body.compID,
    viza:0,
    aprob:0,
    suma:req.body.suma,
    stare:'activ',
    idClient:8,
    nrdoc
  
}).then((d)=>{
  return res.status(200).json({
    message: "Antet angajament adaugat",
    id:d[0]

  })
}).catch(err =>{ console.log(err)})
 }