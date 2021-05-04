const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');



//hashing des MP
const bcrypt = require('bcrypt');
const saltRounds =10;

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods : ["GET", "POST"],
  credentials:true // autorise cookie
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : true}));

//initialiser la session
app.use(session({
  key : "userID", // nom du cookie
  secret: "subscribe",
  resave : false, 
  saveUninitialized:false,
  cookie : {
     expires: 1000 * 60 * 60 * 24, // le cookie dure 1000 milisecondes x 60 (sec) x 60 (min) x 24 (heures) soit 1 jour

  },
}
 
));


const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "reactloginsystem",
});

app.get("/", (req, res) => {
  res.send("hello oooooooo");
});

app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;



    bcrypt.hash(password, saltRounds, (err, hash)=>{

      if(err){
        console.log(err)
      }

      db.query(
        "INSERT INTO users (username, password) VALUES (?,?)",
        [username, hash],
        (err, result) => {
          console.log(err);
        }
      );

    })


});

app.get('/login', (req, res)=>{
  if(req.session.user){
    res.send({loggedIn: true, user: req.session.user})
  } else{
    res.send({loggedIn: false })
  }
})

app.get

app.post('/login', (req, res)=>{
  const username = req.body.username;
    const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ? ; ",
    username,
    (err, result) => {

      if(err){
        res.send({err:err});
      }

      if(result.length > 0){
        bcrypt.compare(password, result[0].password, (error, response)=>{
          if(response){
            req.session.user = result;
            console.log(req.session.user)
            res.send(result)
          } else{
            res.send({message:'Erreur d\'identifiant ou de mot de passe'});
          }
        })
      } else{
        res.send({message:'Cet utilisateur n\'existe pas'})
      }
      console.log(err);
    }
  );
})

app.listen(3001, () => {
  console.log("run 3001");
});
