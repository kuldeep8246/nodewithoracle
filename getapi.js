// module 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

// Use body parser to parse JSON body
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )


// connection
var connAttrs = {
  user          : "system",
  password      : "system",
  connectString : "xe"
}

// Http Method: GET
// URI        : /getapi
// Read all the user profiles
app.get('/getapidata', function (req, res) {
    "use strict";
  
    oracledb.getConnection(connAttrs, function (err, connection) {
       
        connection.execute("SELECT * FROM emp1", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                throw err
              }
              res.status(200).json(result.rows)     
        });
    });
  });


  // Http Method: GET
// URI        : /getapi
// Read all the user profiles
app.get('/getapid/:id', function (req, res) {
    "use strict";
  
    oracledb.getConnection(connAttrs, function (err, connection) {
       
        connection.execute("SELECT * FROM emp1 where id=:id",  [req.params.id], {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                throw err
              }
              res.contentType('application/json').status(200).send(JSON.stringify(result.rows));    
        });
    });
  });

   // Http Method: post
// URI        : /postapi
// Read all the user profiles
app.post('/postapi', function (req, res) {
    "use strict";
  
    oracledb.getConnection(connAttrs, function (err, connection) {
        var id=req.body.id;
        var namekp=req.body.namekp;
        var citykp =req.body.citykp;
        console.log(id+"    "+namekp+"            "+citykp);
        connection.execute("INSERT INTO emp1 VALUES(:id,:name, :city) ", [id,namekp, citykp], {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                throw err
              }
            //  res.status(201).set('Location', '/user_profiles/' + req.body.namekp);
              res.send(JSON.stringify({
                 status:'Created User'
              }));
              res.end(); 
        });
    });
  });


    // Http Method: put
// URI        : /putapi
// Read all the user profiles
app.put('/putapi/:id', function (req, res) {
    "use strict";
  
    oracledb.getConnection(connAttrs, function (err, connection) {
        var id=req.params.id;
        var namekp=req.body.namekp;
        var citykp =req.body.citykp;
        console.log(id+"    "+namekp+"            "+citykp);
        //update emp1 set name='monty',city='ddun' where id=8;
        connection.execute("update emp1 set name=:name,city=:city where id=:id", [namekp, citykp,id], {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                throw err
              }
            //  res.status(201).set('Location', '/user_profiles/' + req.body.namekp);
              res.send(JSON.stringify({
                 status:'Created User'
              }));
              res.end(); 
        });
    });
  });

   // Http Method: delete
// URI        : /putapi
// Read all the user profiles
app.delete('/deleteapi/:id', function (req, res) {
    "use strict";
  
    oracledb.getConnection(connAttrs, function (err, connection) {
        var id=req.params.id;
       
        console.log(id);
        //delete emp1 where id=:id;
        connection.execute("delete from emp1 where id=:id", [id], {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            if (err) {
                throw err
              }
            //  res.status(201).set('Location', '/user_profiles/' + req.body.namekp);
              res.send(JSON.stringify({
                 status:'Deleted User'
              }));
              res.end(); 
        });
    });
  });


   // server
 var server = app.listen(6000, function () {  
  var host = server.address().address  
    var port = server.address().port  
    console.log("Example app listening at http://%s:%s", host, port)  
  });