const mySql = require('mysql');
const ENV = process.env;
const connection = mySql.createConnection({
    host:ENV.HOST,
    user:ENV.USER,
    password:ENV.PASSWORD,
    database:ENV.DATABASE,
    port:ENV.DB_PORT
})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
})



module.exports = connection;

