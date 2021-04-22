const mysql = require('mysql');
const { promisify } = require('util');
const {database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        console.error('Error para conectar la base de datos');
    }

    if(connection)
        connection.release();
    console.log('Conectado a la bd')
    return;
})

pool.query = promisify(pool.query);

module.exports = pool;
