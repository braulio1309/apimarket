
//Requires
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../database');
const config = require('./database/config');


//Ejecutar express
const app = express();

//Cargar archivos de rutas
const usuario_routes        = require('./routes/usuario');
const roles_routes          = require('./routes/roles');
const metaUsuarios_routes   = require('./routes/metausuarios');
const metaRoles_routes      = require('./routes/metaroles');
const Usuarios_roles_routes      = require('./routes/usuario_roles');
const tiendas_routes      = require('./routes/tiendas');
const productos_routes      = require('./routes/productos');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());


//Reescribir rutas
app.use('/api', usuario_routes);
app.use('/api', roles_routes);
app.use('/api', metaUsuarios_routes);
app.use('/api', metaRoles_routes);
app.use('/api', Usuarios_roles_routes);
app.use('/api', tiendas_routes);
app.use('/api', productos_routes);

//Corriendo servidor
app.listen(config.PORT, () => {
    console.log('Servidor corriendo exitosamente'+ config.PORT);
})

//Exportar modulo
module.exports = app;

