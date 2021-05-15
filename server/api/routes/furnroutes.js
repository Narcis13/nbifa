const express =require("express");
const router = express.Router();

const FurnController =require('../controllers/furn');

router.get("/toti/:idcomp", /*checkaut,*/ FurnController.toti); 
router.post("/furnizornou", FurnController.furnizor_nou);


module.exports=router;