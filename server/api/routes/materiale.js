const express =require("express");
const router = express.Router();
const checkaut =require('../middleware/check-aut');
const MaterialeController =require('../controllers/materiale');
//const checkAuth = require('../middleware/check-auth');

router.post("/materialnou", MaterialeController.materialnou);

//router.post("/login", UserController.user_login);

//router.delete("/:userId", /*checkaut,*/ UserController.user_delete);
router.patch("/sterg/:id", /*checkaut,*/ MaterialeController.sterg_material);
router.get("/toate", /*checkaut,*/ MaterialeController.toate); 


module.exports=router;