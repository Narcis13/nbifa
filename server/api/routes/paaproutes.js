const express =require("express");
const router = express.Router();

const PAAPController =require('../controllers/paap');

router.get("/paapintegral/:idcomp/:an", /*checkaut,*/ PAAPController.tot); 


module.exports=router;