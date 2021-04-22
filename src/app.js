
//Requires
var express = require('express');
var bodyParser = require('body-parser');
var pool = require('../database');

//Ejecutar express
var app = express();

//Cargar archivos de rutas
var usuario_routes = require('./routes/usuario');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS

//Reescribir rutas
app.use('/api', usuario_routes);

//Corriendo servidor
app.listen(8000, () => {
    console.log('Servidor corriendo exitosamente');
})

//Exportar modulo
module.exports = app;

