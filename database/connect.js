const mysql = require('mysql');


//connection to database
const connection =  mysql.createConnection({
    host :'localhost',
    user :'root',
    password:"",
    database:"apppayment"
});


module.exports={connection};