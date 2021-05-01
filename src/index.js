
//Requires
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../database');
const config = require('./database/config');

//Ejecutar express
const app = express();

//Cargar archivos de rutas
const usuario_routes = require('./routes/usuario');
const roles_routes = require('./routes/roles');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(bodeyParser.json());

//CORS

//Reescribir rutas
app.use('/api', usuario_routes);
app.use('/api', roles_routes);

//Corriendo servidor
app.listen(config.PORT, () => {
    console.log('Servidor corriendo exitosamente'+ config.PORT);
})

//Exportar modulo
module.exports = app;

