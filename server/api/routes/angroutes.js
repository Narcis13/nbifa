const express =require("express");
const router = express.Router();

const AngController =require('../controllers/ang');

router.get("/toate/:idcomp", /*checkaut,*/ AngController.toate); 


module.exports=router;