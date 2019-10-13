const knex =require('../../db.js');
/*const User = require("../models/user");*/

module.exports.toate_locurile = (req, res, next) => {
    console.log('sunt in controllerul locuri actiunea toate_locurile....')
    knex('locuri').orderBy(['prioritate', { column: 'denumire', order: 'asc' }]).then((rows)=>{
      return res.status(200).json({
       message: "Toate locurile",
       locuri:rows
     });
    }).catch(err =>{})
}