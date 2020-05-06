const knex =require('../../db.js');
const fs = require("fs");   
const path=require("path");
//const moment = require('moment');
let config = require('./reports/config.json');
let ejs = require('ejs');
/*const User = require("../models/user");*/

module.exports.analitica = (req, res, next) => {
    console.log('sunt in controllerul balante actiunea analitica de gestiune....',req.body)
let sql=`SELECT 
m.denumire,
tranzactii.id_reper,
m.um um,
ifnull(sum(case when op.data < '2020-04-07' then tranzactii.cantitate_debit-tranzactii.cantitate_credit end),0) stocinitial,
ifnull(sum(case when op.data >= '2020-04-07' and op.data <= '2020-04-30' then tranzactii.cantitate_debit end),0) ti,
ifnull(sum(case when op.data >= '2020-04-07' and op.data <= '2020-04-30' then tranzactii.cantitate_credit end),0) te,
sum(tranzactii.cantitate_debit-tranzactii.cantitate_credit) as stocfinal,
ifnull(sum(case when op.data < '2020-04-07' then tranzactii.debit-tranzactii.credit end),0) valoarestocinitial,
ifnull(sum(case when op.data >= '2020-04-07' and op.data <= '2020-04-30' then tranzactii.debit end),0) vi,
ifnull(sum(case when op.data >= '2020-04-07' and op.data <= '2020-04-30' then tranzactii.credit end),0) ve,
sum(tranzactii.debit-tranzactii.credit) as valoarestoc
FROM bifa.tranzactii 
inner join materiale m on m.id=id_reper
inner join operatiuni  op on op.id=tranzactii.idAntet
where tranzactii.stare_material LIKE '%' and tranzactii.tip_material='M'  and id_categ>=1 and tranzactii.stare='ACTIV' and id_gestiune=1 and id_locdispunere=1
group by id_reper`;

knex.raw(sql,[]).then(
    r=>{
     // console.log("Raspuns de la query stoc pret mediu",r)
     return res.status(200).json({
      message: "Balanta analitica de gestiune",
      balanta:r
    });
    }
  ).catch(err =>{console.log(err)})
}


module.exports.raportanalitica = (req,res,next)=>{
  console.log("Sunt in controllerul balante actiunea raportanalitica",req.body);
  let set_date={};
    
    
  var ejs_template = fs.readFileSync(path.join(__dirname,'reports','analitica.ejs'),'utf8'),
       style=fs.readFileSync(path.join(__dirname,'reports','styles.css'),'utf8');

       const html = ejs.render(ejs_template, {set_date,style,config});
       res.send(html);
}