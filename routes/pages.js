const express=require("express");
const router=express.Router();
const authController=require("../controllers/auth");

router.get('/',function(req,res){
    res.render("index");
});

router.get('/register',function(req,res,next){
    res.render("register");
});

router.get('/login',function(req,res,next){
    res.render("login");
});
router.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
})

router.get('/main',function(req,res,next){
    if(req.session.loggedinUser){
        res.render("main",{email:req.session.emailAddress,name:req.session.name});
    }else{
        res.redirect("/login");
    }   
})

router.get('/auth/login',function(req,res){
    res.redirect("login");
})

router.get('/adduser',function(req,res){
    res.render("adduser",{email:req.session.emailAddress,name:req.session.name});
})

router.get('/listuser',function(req,res,next){
    authController.listuser(req,res,next);
})
router.get("/listmashup",function(req,res,next){
    authController.listmashup(req,res,next);
})
router.get('/mashup',function(req,res){
    authController.ticket(req,res);
    // res.render("mashup",{email:req.session.emailAddress,name:req.session.name,ticket:req.session.ticket});
})
router.get("/config",function(req,res){
    // let wsres=LoadAppData();
    res.render("config",{email:req.session.emailAddress,name:req.session.name})
})
module.exports = router;