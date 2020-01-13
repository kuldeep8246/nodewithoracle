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
// URI        : /user_profiles
// Read all the user profiles
app.get('/user_profiles', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
      if (err) {
          // Error connecting to DB
          res.set('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
              status: 500,
              message: "Error connecting to DB",
              detailed_message: err.message
          }));
          return;
      }

      connection.execute("SELECT * FROM emp1", {}, {
          outFormat: oracledb.OBJECT // Return the result as Object
      }, function (err, result) {
          if (err) {
              res.set('Content-Type', 'application/json');
              res.status(500).send(JSON.stringify({
                  status: 500,
                  message: "Error getting the user profile",
                  detailed_message: err.message
              }));
          } else {
              res.contentType('application/json').status(200);
              res.send(JSON.stringify(result.rows));
          }
          // Release the connection
          connection.release(
              function (err) {
                  if (err) {
                      console.error(err.message);
                  } else {
                      console.log("GET /user_profiles : Connection released");
                  }
              });
      });
  });
});



// Http method: POST
// URI        : /user_profiles
// Creates a new user profile
app.post('/user_profiles', function (req, res) {
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
        var id=req.body.id;
        var namekp=req.body.namekp;
        var citykp =req.body.citykp;
        console.log(id+"    "+namekp+"            "+citykp);
                connection.execute("INSERT INTO emp1 VALUES(:id,:name, :city) ", [id,namekp, citykp], {
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
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("POST /user_profiles : Connection released");
                        }
                    });
            });
    });
});
 


// Build UPDATE statement and prepare bind variables
var buildUpdateStatement = function buildUpdateStatement(req) {
    "use strict";

    var statement = "",
        bindValues = {};
    if (req.body.namekp) {
        statement += "namekp = :namekp"; 
        bindValues.namekp = req.body.namekp;
        console.log( bindValues.namekp);
    }
    if (req.body.citykp) {
        if (statement) statement = statement + ", ";
        statement += "citykp = :citykp";
        console.log(statement);
        bindValues.citykp = req.body.citykp;
        console.log(bindValues.citykp);

    }
    
    

    statement += " WHERE id = :id";
    bindValues.id = req.params.id;
    console.log(bindValues.id);
    statement = "UPDATE emp1 SET " + statement;

    return {
        statement: statement,
        bindValues: bindValues
    };
};


// Http method: PUT
// URI        : /user_profiles/:USER_NAME
// Update the profile of user given in :USER_NAME
app.put('/user_profiles/:id', function (req, res) {
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

        var updateStatement = buildUpdateStatement(req);
     // const updateSql ="update emp1 set namekp = :namekp,citykp = :citykp where id = :id";
     // console.log(updateSql);

     const namekp=req.body.namekp;
     const citykp=req.body.citykp;
     const id = parseInt(req.params.id);
     console.log(id+"----"+namekp+"----"+citykp );
     //update emp1 set name='monty',city='ddun' where id=8;
     //update emp1 set namekp = :namekp,citykp = :citykp where id = :id",{namekp:'uweyri',citykp:'ddun',id:1}
        connection.execute("update emp1 set name=:name,city=:city where id=:id",{namekp,citykp,id},{
                autoCommit: true,
                outFormat: oracledb.OBJECT // Return the result as Object
            },
            function (err, result) {
                if (err  || result.rowsAffected === 0) {
                    // Error
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err ? "Input Error" : "User doesn't exist",
                        detailed_message: err ? err.message : ""
                    }));
                } else {
                    // Resource successfully updated. Sending an empty response body. 
                    res.status(204);
                    res.send(JSON.stringify({
                        status:'Update User'
                    }));
                    res.end();
                }
                // Release the connection
                connection.release(
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("PUT /user_profiles/" + req.params.namekp + " : Connection released ");
                        }
                    });
            });
    });
});


// Http method: DELETE
// URI        : /userprofiles/:USER_NAME
// Delete the profile of user given in :USER_NAME
app.delete('/user_profiles/:id', function (req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function (err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }

        connection.execute("DELETE FROM emp1 WHERE id = :id", [req.params.id], {
            autoCommit: true,
            outFormat: oracledb.OBJECT
        }, function (err, result) {
            if (err || result.rowsAffected === 0) {
                // Error
                res.set('Content-Type', 'application/json');
                res.status(400).send(JSON.stringify({
                    status: 400,
                    message: err ? "Input Error" : "User doesn't exist",
                    detailed_message: err ? err.message : ""
                }));
            } else {
                // Resource successfully deleted. Sending an empty response body. 
                res.status(204).end();
            }
            // Release the connection
            connection.release(
                function (err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("DELETE /user_profiles/" + req.params.USER_NAME + " : Connection released");
                    }
                });

        });
    });
});

 // server
 var server = app.listen(6000, function () {  
  
  var host = server.address().address  
  var port = server.address().port  
  console.log("Example app listening at http://%s:%s", host, port)  
  
})  