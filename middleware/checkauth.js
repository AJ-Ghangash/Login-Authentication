const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");

dotenv.config({ path: './.env'});

module.exports=(req,res,next)=>{
    try{
    const decoded=jwt.verify(req.body.token,process.env.JWT_KEY);
    req.userData=decoded;
    next();
    }catch(error){
        return res.render("login",{
            message:"Auth Failed Please Login Again"
        });
    }
    next();
};