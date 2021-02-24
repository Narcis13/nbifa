const knex =require('../../dbaky.js');


module.exports.toate = (req,res,next) => {
  console.log('Toate angajamentele',req.params.idcomp)

let sql=`SELECT statistici.nr,ang.id,antang.nrdoc,ang.idAntet, antang.dataang,antang.detalii,ang.suma,ang.codCap,ang.numecap,ang.artbug,c.denumire compartiment,c.id idcompartiment,antang.stare FROM adata.angajamente ang 
left join adata.anteteangajamente antang on antang.id=ang.idAntet
inner join compartimente c on c.id=antang.compID
inner join (select idAntet, count(idAntet) as nr from adata.angajamente group by idAntet ) statistici on statistici.idAntet=ang.idAntet
where dataang>'2021-01-01' and antang.stare='activ' and  c.id=14

order by ang.artbug,ang.idAntet,ang.id`;

knex.raw(sql,[]).then(
  r=>{
   // console.log("Raspuns de la query stoc pret mediu",r)
   return res.status(200).json({
    message: "Toate angajamentele",
    angajamente:r
   
  });
  }
).catch(err =>{console.log(err)})


    
  
  
 }