const express =require("express");
const router = express.Router();

const AngController =require('../controllers/ang');

router.get("/toate/:idcomp", /*checkaut,*/ AngController.toate); 
router.get("/calcdezangajare/:idang", /*checkaut,*/ AngController.calc_dezangajare); 
router.get("/catbugetare/:idcomp", /*checkaut,*/ AngController.categorii_bugetare); 
router.post("/angnou", AngController.angajament_nou);
router.post("/angnoudetalii", AngController.angajament_nou_detalii);
router.post("/angsuplimentare", AngController.angajament_nou_detalii);

module.exports=router;