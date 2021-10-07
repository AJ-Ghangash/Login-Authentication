const express=require("express");
const authController=require("../controllers/auth");
const router=express.Router();

router.post('/register', authController.register);
router.post('/login',authController.login);
router.post('/adduser',authController.adduser);
router.post('/addMashup',authController.addMashup);
module.exports = router;