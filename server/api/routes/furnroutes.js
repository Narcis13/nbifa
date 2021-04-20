const express =require("express");
const router = express.Router();

const FurnController =require('../controllers/furn');

router.get("/toti/:idcomp", /*checkaut,*/ FurnController.toti); 


module.exports=router;