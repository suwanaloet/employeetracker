const mysql = require("mysql2")

//connect to databse
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pleasehackme!23',
    database: 'company'
});

//export
module.exports = db;