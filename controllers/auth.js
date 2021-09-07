
let mysql=require("mysql");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotenv=require("dotenv");

dotenv.config({ path: './.env'});

const db=mysql.createConnection({     //process.env is use for protection of sensitive information
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register=function(req,res){

    // const name=req.body.name;
    // const email=req.body.email;
    // const password=req.body.password;
    // const passwordConfirm=req.body.passwordConfirm;

    //shortcut technique to write above line shortly
    const {name ,email ,password, passwordConfirm}=req.body;

    //query for database

    db.query('SELECT email FROM users WHERE email=?',[email],async function(error,results){
        if(error){
            console.log(error);
        }

        if(results.length>0){
            return res.render('register',{
                message:'email is already in use'
            })
        }else if(password !== passwordConfirm){
            return res.render('register',{
                message:'password do not match'
            })
        }

        let hashedpassword=await bcrypt.hash(password,8);
        
        db.query('INSERT INTO users SET ?',{name: name, email: email, password: hashedpassword},function(error,results){
            if(error){
                console.log(error);
            }else{
                console.log(results);
                res.render('register',{
                    message:'User Register'
                })
            }
        });
        res.render("login");
    });



}

exports.login=function(req,res){
    //console.log(req.body);
    const {email, password}=req.body;
    db.query('SELECT name,email,password FROM users WHERE email=?',[email],function(errors,results){
        if(errors){
            console.log(error);
        }
        if(results.length>0){
            bcrypt.compare(password, results[0].password, function(err, isMatch) {
                if (err) {
                  throw err
                } else if (!isMatch) {
                    return res.render('login',{
                        message:'Auth Failed'
                    })
                } else {
                   const token= jwt.sign({
                        email:results[0].email,
                        name:results[0].name
                    },
                     process.env.JWT_KEY,
                     {
                         expiresIn:"1h"
                     })
                    res.render("main",{
                        message:results[0].name,token:token
                    })
                    // res.status(200).json({
                    //     message:"Succesfull Login",
                    //     token:token
                    // })
                }
            })
        }
    })
}