let express=require("express");
const app=express();
const path=require("path");
let mysql=require("mysql");
const dotenv=require("dotenv");
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 }
}))

dotenv.config({ path: './.env'});



const db=mysql.createConnection({     //process.env is use for protection of sensitive information
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');  //for saving css and javascript files
app.use(express.static(publicDirectory));  //this line help server to use the css and javascript files


// //parse url encoded form data
// app.use(express.urlencoded({extended:true}));
// //and then converted into json format
// app.use(express.json);

//to handle handlebars we use hbs
app.set('view engine','hbs');

db.connect((error)=>{
    if(error){
        console.log(error);
    }else{
        console.log("db connected ..");
    }
});

//define routes
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));



app.listen(8080,()=>{
    console.log("server started");
});