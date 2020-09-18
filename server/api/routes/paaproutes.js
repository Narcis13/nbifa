const express =require("express");
const router = express.Router();

const PAAPController =require('../controllers/paap');

router.get("/paapintegral/:idcomp", /*checkaut,*/ PAAPController.tot); 


module.exports=router;