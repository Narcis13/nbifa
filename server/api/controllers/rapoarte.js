const puppeteer = require('puppeteer');
const knex =require('../../db.js');
const fs = require("fs");   
const path=require("path");
const moment = require('moment');
let config = require('./reports/config.json');
let ejs = require('ejs');

function moData(input){
    return input.substr(0,4)+'-'+input.substr(5,2)+'-'+input.substr(8,2);
}

module.exports.documente_interval = (req,res,next) => {
    console.log('sunt in controllerul rapoarte actiunea documente_interval',req.body);

 (async () => {

  let set_date={start:req.body.inceput, stop:req.body.sfirsit};
    
  knex.select(['operatiuni.id', 'operatiuni.idtipoperatiuni', 'operatiuni.tipoperatiune','operatiuni.data' ,'operatiuni.nrdoc', 'operatiuni.stare','operatiuni.datacreere','operatiuni.datamodificare'])
  .from('operatiuni')
  .innerJoin('tranzactii','operatiuni.id','tranzactii.idAntet').sum('tranzactii.debit as debit').sum('tranzactii.credit as credit')
  .whereRaw('operatiuni.stare=? and operatiuni.data >= ? and operatiuni.data <= ? and operatiuni.idgestiune = ?',['ACTIV',moData(req.body.inceput),moData(req.body.sfirsit),req.body.idgestiune])
  .groupBy('tranzactii.idAntet')
  .then(async (rows)=>{
   //console.log(rows)
      let totaldebit=0,totalcredit=0;
      rows.forEach(r=>{
          r.debit=parseFloat(r.debit).toFixed(2);
          totaldebit+=parseFloat(r.debit);
          r.credit=parseFloat(r.credit).toFixed(2);
          totalcredit+=parseFloat(r.credit)
          r.data=moment(r.data).format('DD/MM/YYYY');
      }) 
       set_date.docs=rows;
       set_date.totaldebit=totaldebit;
       set_date.totalcredit=totalcredit;
       var ejs_template = fs.readFileSync(path.join(__dirname,'reports','documente_interval.ejs'),'utf8'),
      style=fs.readFileSync(path.join(__dirname,'reports','styles.css'),'utf8')
      html = ejs.render(ejs_template, {set_date,style,config});
      //console.log("LABORATOR RAPOARTE");
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      //await page.emulateMedia('screen');
      await page.setContent(html);
      const pdf=await page.pdf({ format: 'A4', printBackground:true});
      
      await browser.close();
  
      res.type("application/pdf");
      res.send(pdf);

 }).catch(err =>{console.log(err)})



  })();

}

module.exports.un_document = (req,res,next) => {
    console.log('sunt in controllerul rapoarte actiunea un_document',req.params.iddoc);

    let set_date={};
    
    
    var ejs_template = fs.readFileSync(path.join(__dirname,'reports','un_document.ejs'),'utf8'),
   style=fs.readFileSync(path.join(__dirname,'reports','styles.css'),'utf8');

  knex.select(['operatiuni.idtipoperatiuni', 'operatiuni.tipoperatiune', 'operatiuni.data' ,'operatiuni.nrdoc', {categorie:'categorii.denumire'}, {gestiune:'gestiuni.denumire'}, {loc:'locuri.denumire'}, {material:'materiale.denumire'},'tranzactii.um','tranzactii.cantitate_debit','tranzactii.cantitate_credit','tranzactii.pret','tranzactii.debit','tranzactii.credit','tranzactii.stare_material'])
  .from('tranzactii')
  .innerJoin('operatiuni','operatiuni.id','tranzactii.idAntet')
  .innerJoin('categorii','categorii.id','tranzactii.id_categ')
  .innerJoin('gestiuni','gestiuni.id','tranzactii.id_gestiune')
  .innerJoin('locuri','locuri.id','tranzactii.id_locdispunere')
  .innerJoin('materiale','materiale.id','tranzactii.id_reper')
  .whereRaw('tranzactii.stare=? and tranzactii.idAntet = ? ',['ACTIV',req.params.iddoc])
  .then( rows=>{
      //console.log(rows)
      let totaldebit=0,totalcredit=0;
      rows.forEach(r=>{
          r.debit=parseFloat(r.debit).toFixed(2);
          totaldebit+=parseFloat(r.debit);
          r.credit=parseFloat(r.credit).toFixed(2);
          totalcredit+=parseFloat(r.credit)
          r.pret=parseFloat(r.pret).toFixed(2);
          r.data=moment(r.data).format('DD/MM/YYYY');
      }) 
       set_date.tipoperatiune=rows[0].tipoperatiune;
       set_date.nrdoc=rows[0].nrdoc;
       set_date.datadoc=rows[0].data;
       set_date.gestiune=rows[0].gestiune;
       set_date.loc=(rows.length>1&&rows[1].loc!==rows[0].loc)?rows[0].loc+' > '+rows[1].loc:rows[0].loc;
       set_date.stare=(rows.length>1&&rows[1].stare_material!==rows[0].stare_material)?rows[0].stare_material+' > '+rows[1].stare_material:rows[0].stare_material;
       set_date.linii=rows;
       set_date.totaldebit=totaldebit;
       set_date.totalcredit=totalcredit;

      const html = ejs.render(ejs_template, {set_date,style,config});
      res.send(html);

  })
  .catch(err =>{console.log(err)})

}