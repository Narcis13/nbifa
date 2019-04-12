const express =require("express");
const router = express.Router();

const ContController =require('../controllers/cont');
//const checkAuth = require('../middleware/check-auth');

//router.post("/signup", UserController.user_signup);

//router.post("/gestiunenoua", GestController.gestiunenoua);

//router.delete("/:idgest", /*checkaut,*/ GestController.sterg_gestiune);

//router.patch("/:idgest", /*checkaut,*/ GestController.update_gestiune);

router.get("/toate", /*checkaut,*/ ContController.toate); 


module.exports=router;