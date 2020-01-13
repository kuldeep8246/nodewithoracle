// module 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var oracledb = require('oracledb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Use body parser to parse JSON body
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  var usern;
  var company;
// connection
var connAttrs = {
  user          : "system",
  password      : "system",
  connectString : "xe"
}


/*

// Http method: POST
// URI        : /userProfiles
// Creates a new user profile
app.post('/userProfiles', function (req, res) {
    "use strict";
    if ("application/json" == req.get('Content-Type')) {
        res.set('Content-Type', 'application/json').status(415).send(JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null
        }));
        return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json').status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        var password;
        var hashpass;
        var id=req.body.id;
        var name=req.body.name;
        var email =req.body.email;
        password=req.body.password;
        // bcrypt.genSalt(10, function(err, salt) {
        //     bcrypt.hash(password, salt, function(err, hash) {
        //         // Store hash in your password DB.
        //         hashpass=hash;
        //     });
        // });
        console.log("password----------"+hashpass);
        console.log(id+"    "+name+"            "+email+" -----"+password);
                connection.execute("INSERT INTO userData VALUES(userData_sequence.nextval,:name, :email,:password) ", [name, email,password], {
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf("ORA-00001") > -1 ? "User already exists" : "Input Error",
                        detailed_message: err.message
                    }));
                } else {
                    // Successfully created the resource
                    res.status(201).set('Location', '/user_profiles/' + req.body.namekp);
                    res.send(JSON.stringify({
                       status:'Created User'
                    }));
                    res.end();
                }
             
            });
    });
});
*/

let rawdata = fs.readFileSync('emp.json');
let student = JSON.parse(rawdata);
usern=student.username;
company=student.company;
console.log(usern+"-------"+company);

app.post('/api/posts',verifyToken,(req,res) => {
    jwt.verify(req.token,'secretkey' , (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.json({
                message: 'post created......',
                authData
            })
        }
    })
    
})

app.post('/api/login', (req,res) => {
    // Mock User
     const user = {
         id: 1,
         username: 'kuldeep',
        company: 'awc'
     }

  
    jwt.sign({user}, 'secretkey', { expiresIn: '120s' },(err,token) => {
        res.json({
            token
        })
    })
})



//Format of Token
//Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req,res,next){
    // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined'){
            //Split at the space
            const bearer = bearerHeader.split(' ');
            //Get Token from array
            const bearerToken = bearer[1];
            //Set the token
            req.token = bearerToken;
            //Next middleware
            next();
        }
        else {
            // Forbidden
            res.sendStatus(403);
        }
    }
// server
var server = app.listen(6000, function () {  
  
    var host = server.address().address  
    var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
    
  })  

