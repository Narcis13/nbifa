const knex =require('../db.js');

console.log('SEED MATERIALE.....');

knex('materiale').insert({
    denumire:'Saminta material',
    um:'buc',
    pretpredefinit:13,
    idgestiune:1,
    iduser:3,
    stare:'activ',
        
    datacreere:knex.fn.now(),//new Date().toISOString(),
    datamodificare:knex.fn.now()//new Date().toISOString()

    
}).then((d)=>{
    console.log('Material adaugat',d)
    
  }).catch(err =>{ console.log(err)})