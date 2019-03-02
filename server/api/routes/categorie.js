const express =require("express");
const router = express.Router();

const CatController =require('../controllers/categorie');


router.post("/categorienoua", CatController.categorienoua);

//router.delete("/:idgest", /*checkaut,*/ GestController.sterg_gestiune);

//router.patch("/:idgest", /*checkaut,*/ GestController.update_gestiune);

router.get("/toate", /*checkaut,*/ CatController.toate); 


module.exports=router;