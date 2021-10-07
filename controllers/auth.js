let mysql = require("mysql");
const express = require("express");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const ticket = require("./ticket");
const { Session } = require("express-session");
var localStorage = require('localStorage')

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  //process.env is use for protection of sensitive information
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.register = function (req, res, next) {
  // const name=req.body.name;
  // const email=req.body.email;
  // const password=req.body.password;
  // const passwordConfirm=req.body.passwordConfirm;

  //shortcut technique to write above line shortly
  const { name, email, password, passwordConfirm } = req.body;

  //query for database

  db.query(
    "SELECT email FROM users WHERE email=?",
    [email],
    async function (error, results) {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "password do not match",
        });
      }

      let hashedpassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedpassword },
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            res.render("register", {
              message: "User Register",
            });
          }
        }
      );
    }
  );
};

exports.login = function (req, res) {
  //console.log(req.body);
  const { email, password } = req.body;
  db.query(
    "SELECT name,email,password FROM users WHERE email=?",
    [email],
    function (errors, results) {
      if (errors) {
        console.log(error);
      }
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            return res.render("login", {
              message: "Auth Failed",
            });
          } else {
            // const token = jwt.sign(
            //   {
            //     email: results[0].email,
            //     name: results[0].name,
            //   },
            //   process.env.JWT_KEY,
            //   {
            //     expiresIn: "1h",
            //   }
            // );
            // console.log(token);
            ticket.get_ticket_redirect(function (ticket) {
              console.log(ticket);
              req.session.ticket = ticket;
              req.session.loggedinUser = true;
              req.session.emailAddress = email;
              req.session.name = results[0].name;
              res.render("main",{
                name:req.session.name,
                ticket:req.session.ticket,
              });
            });
            // res.status(200).json({
            //     message:"Succesfull Login",
            //     token:token
            // })
          }
        });
      }
    }
  );
};

exports.adduser = function (req, res, next) {
  // const name=req.body.name;
  // const email=req.body.email;
  // const password=req.body.password;
  // const passwordConfirm=req.body.passwordConfirm;

  //shortcut technique to write above line shortly
  const { name, email, password, passwordConfirm } = req.body;

  //query for database

  db.query(
    "SELECT email FROM users WHERE email=?",
    [email],
    async function (error, results) {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("adduser", {
          message: "email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("adduser", {
          message: "password do not match",
        });
      }

      let hashedpassword = await bcrypt.hash(password, 8);

      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedpassword },
        function (error, results) {
          if (error) {
            console.log(error);
          } else {
            res.render("adduser", {
              message: "User Register",
            });
          }
        }
      );
    }
  );
};

exports.listuser = function (req, res) {
  db.query("SELECT MAX(id) AS max from users", function (error, result) {
    if (error) {
      console.log(error);
    } else {
      var string = JSON.stringify(result);
      var json = JSON.parse(string);
      let array = [];
      for (let i = 0; i <= json[0].max; i++) {
        db.query(
          "SELECT id,name,email FROM users WHERE ?=id",
          [i],
          async function (error, result) {
            if (error) {
              console.log(error);
            } else {
              var string = await JSON.stringify(result);
              var json = JSON.parse(string);
              if (json[0]) {
                array.push(json[0]);
              }
            }
          }
        );
      }

      setTimeout(()=>{
        res.render("listuser", {
          user: array,
          name:req.session.name,
        });
      },2000)
      //req.session.max=ajay;
    }
  });
};

exports.ticket = function (req, res) {
  ticket.get_ticket_redirect(function (ticket) {
    res.render("mashup", {
      name:req.session.name,
      ticket: ticket,
    });
  });
};


exports.addMashup=function(req,res){
    const name=req.body.name;
    const appId=req.body.appId;
    const object1=req.body.object1;
    const object2=req.body.object2;
    const object3=req.body.object3;
    const object4=req.body.object4;
    const email=req.session.emailAddress;
  
    db.query(
      "INSERT INTO mashup SET ?",
      { applicationId: appId, email: email, Object1Id: object1, Object2Id: object2, Object3Id: object3, Object4Id: object4, },
      function (error, results) {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
        }
      }
    );

}

exports.listmashup=function(req,res,next){
  db.query("SELECT id,applicationId,email,Object1Id,Object2Id,Object3Id,Object4Id FROM mashup WHERE email=?",[req.session.emailAddress], async function(error,result){
      if(error){
        console.log(error);
      }else{
        var string = await JSON.stringify(result);
        var json = JSON.parse(string);
       
        setTimeout(()=>{
          res.render("listmashup", {
            mashup:json,
            name:req.session.name,
          });
        },2000) 
      }
  })
}