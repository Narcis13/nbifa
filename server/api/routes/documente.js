const express =require("express");
const router = express.Router();

const DocumenteController =require('../controllers/documente');
//const checkAuth = require('../middleware/check-auth');

router.post("/documentnou", DocumenteController.documentnou);
router.post("/tranzactienoua", DocumenteController.tranzactienoua);

router.post("/documenteinterval", DocumenteController.documenteinterval);

//router.delete("/:userId", /*checkaut,*/ UserController.user_delete);
//router.put("/:idmaterial", /*checkaut,*/ MaterialeController.update);
//router.patch("/sterg/:id", /*checkaut,*/ MaterialeController.sterg_material);
router.get("/tipuridocumente", /*checkaut,*/ DocumenteController.tipuridocumente); 


module.exports=router;