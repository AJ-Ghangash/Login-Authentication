const express=require("express");
const router=express.Router();
const checkAuth=require("../middleware/checkauth");

router.get('/',function(req,res){
    res.render("index");
});

router.get('/register',function(req,res){
    res.render("register");
});

router.get('/login',function(req,res){
    res.render("login");
});

router.get('/main',checkAuth,function(req,res){
    res.render("main");
})
router.get('/auth/login',checkAuth,function(req,res){
    res.render("login");
})

module.exports = router;