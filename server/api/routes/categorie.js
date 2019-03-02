const express =require("express");
const router = express.Router();

const CatController =require('../controllers/categorie');


router.post("/categorienoua", CatController.categorienoua);

//router.delete("/:idgest", /*checkaut,*/ GestController.sterg_gestiune);
router.put("/:idcateg", /*checkaut,*/ CatController.update);

router.patch("/:idcateg", /*checkaut,*/ CatController.update_categorie);

router.get("/toate", /*checkaut,*/ CatController.toate); 


module.exports=router;