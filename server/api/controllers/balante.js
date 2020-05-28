const knex =require('../../db.js');
const fs = require("fs");   
const path=require("path");
//const moment = require('moment');
let config = require('./reports/config.json');
let ejs = require('ejs');
/*const User = require("../models/user");*/

module.exports.analitica = (req, res, next) => {
  let sql_categ=req.body.categorii==="*"?">=1":"="+req.body.categorii;
  let sql_stari=req.body.stari==="*"?"%":req.body.stari;
  let sql_locuri=req.body.locuri==="*"?">=1":"="+req.body.locuri;
    console.log('sunt in controllerul balante actiunea analitica de gestiune....',req.body,sql_categ)
    
let sql=`SELECT 
m.denumire,
tranzactii.id_reper,
m.um um,
ifnull(sum(case when op.data < '${req.body.datainceput}' then tranzactii.cantitate_debit-tranzactii.cantitate_credit end),0) as stocinitial,
ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_debit end),0) ti,
ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_credit end),0) te,
ifnull(sum(case when op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_debit-tranzactii.cantitate_credit end),0) as stocfinal,
ifnull(sum(case when op.data < '${req.body.datainceput}' then tranzactii.debit-tranzactii.credit end),0) as valoarestocinitial,
ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.debit end),0) vi,
ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.credit end),0) ve,
ifnull(sum(case when op.data <= '${req.body.datasfirsit}' then tranzactii.debit-tranzactii.credit end),0) as valoarestoc
FROM bifa.tranzactii 
inner join materiale m on m.id=id_reper
inner join operatiuni  op on op.id=tranzactii.idAntet
where tranzactii.stare_material LIKE '${sql_stari}' and tranzactii.tip_material='${req.body.tipmaterial}'  and id_categ${sql_categ} and tranzactii.stare='ACTIV' and id_gestiune=${req.body.idgestiune} and id_locdispunere${sql_locuri}
group by id_reper
having stocinitial>0 or stocfinal>0`;

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
  set_date.gestiune=req.body.gestiune  ;
  set_date.datainceput=req.body.datainceput  ;
  set_date.datasfirsit=req.body.datasfirsit  ;
  set_date.stare=req.body.stari==="*"?'Toate Starile': req.body.stari ;
  set_date.denumiretipmaterial=req.body.denumiretipmaterial  ;
  set_date.denumireloc=req.body.denumireloc  ;
  set_date.denumirecategorie=req.body.denumirecategorie  ;
    
  var ejs_template = fs.readFileSync(path.join(__dirname,'reports','analitica.ejs'),'utf8'),
       style=fs.readFileSync(path.join(__dirname,'reports','analitica_styles.css'),'utf8');

       let sql_categ=req.body.categorii==="*"?">=1":"="+req.body.categorii;
       let sql_stari=req.body.stari==="*"?"%":req.body.stari;
       let sql_locuri=req.body.locuri==="*"?">=1":"="+req.body.locuri;
    
         
     let sql=`SELECT 
     m.denumire,
     tranzactii.id_reper,
     m.um um,
     ifnull(sum(case when op.data < '${req.body.datainceput}' then tranzactii.cantitate_debit-tranzactii.cantitate_credit end),0) as stocinitial,
     ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_debit end),0) ti,
     ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_credit end),0) te,
     ifnull(sum(case when op.data <= '${req.body.datasfirsit}' then tranzactii.cantitate_debit-tranzactii.cantitate_credit end),0) as stocfinal,
     ifnull(sum(case when op.data < '${req.body.datainceput}' then tranzactii.debit-tranzactii.credit end),0) as valoarestocinitial,
     ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.debit end),0) vi,
     ifnull(sum(case when op.data >= '${req.body.datainceput}' and op.data <= '${req.body.datasfirsit}' then tranzactii.credit end),0) ve,
     ifnull(sum(case when op.data <= '${req.body.datasfirsit}' then tranzactii.debit-tranzactii.credit end),0) as valoarestoc
     FROM bifa.tranzactii 
     inner join materiale m on m.id=id_reper
     inner join operatiuni  op on op.id=tranzactii.idAntet
     where tranzactii.stare_material LIKE '${sql_stari}' and tranzactii.tip_material='${req.body.tipmaterial}'  and id_categ${sql_categ} and tranzactii.stare='ACTIV' and id_gestiune=${req.body.idgestiune} and id_locdispunere${sql_locuri}
     group by id_reper
     having stocinitial>0 or stocfinal>0`;
     let nrcrt=1,tsf=0,tsi=0,rd=0,rc=0,linii=[];
     knex.raw(sql,[]).then(
      r=>{
       // console.log("Raspuns de la query balanta",r)
       r[0].map((linie=>{
        linii.push({
            nrcrt,
            id_reper:linie.id_reper,
            denumire:linie.denumire,
            um:linie.um,
            stocinitial:linie.stocinitial,
            ti:linie.ti,
            te:linie.te,
            stocfinal:linie.stocfinal,
            valoarestocinitial:parseFloat(linie.valoarestocinitial).toFixed(2),
             vi:parseFloat(linie.vi).toFixed(2),
              ve:parseFloat(linie.ve).toFixed(2),
               valoarestoc:parseFloat(linie.valoarestoc).toFixed(2),

        })
         nrcrt++;
         tsf+=parseFloat(linie.valoarestoc);
         tsi+=parseFloat(linie.valoarestocinitial);
         rd+=parseFloat(linie.vi);
         rc+=parseFloat(linie.ve);
      }))

      set_date.linii=linii;
      set_date.tsf=tsf;
      set_date.tsi=tsi;
      set_date.rd=rd;
      set_date.rc=rc;


       const html = ejs.render(ejs_template, {set_date,style,config});
       res.send(html);
      }
    ).catch(err =>{console.log(err)})

}