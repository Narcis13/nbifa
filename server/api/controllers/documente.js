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