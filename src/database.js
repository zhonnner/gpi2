const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'fer',
    password: 'password',//Poner clave propia
    database: 'informeriesgos'
});

conn.connect(function (err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log('La base de dato esta conectada')
    }
});

module.exports = conn;