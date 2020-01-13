var express = require('express');
var app = express();
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
var connection;
port = 6000;



  

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
 //app.get('/a', a);