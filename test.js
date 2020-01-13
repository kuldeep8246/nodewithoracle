var express = require('express');
var app = express();
var oracledb = require('oracledb');
//oracledb.outFormat = oracledb.OBJECT;

const getUsers = oracledb.getConnection(
  {
    user          : "system",
    password      : "system",
    connectString : "xe"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(

      "SELECT * from emp1",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });

  app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


app.get('/users', getUsers)

module.exports = {
    getUsers
   // getUserById,
   // createUser,
   // updateUser,
   // deleteUser,
  }