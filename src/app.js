
//Requires
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../database');
const config = require('./database/config');


//Ejecutar express
const app = express();

//Cargar archivos de rutas
const usuario_routes                = require('./routes/usuario');
const roles_routes                  = require('./routes/roles');
const metaUsuarios_routes           = require('./routes/metausuarios');
const metaRoles_routes              = require('./routes/metaroles');
const Usuarios_roles_routes         = require('./routes/usuario_roles');
const metaProductos_routes          = require('./routes/metaproductos');
const metaTiendas_routes            = require('./routes/metatiendas');
const metaPedidos_routes            = require('./routes/metapedidos');
const pedidos_routes                = require('./routes/pedidos');
const tiendas_routes                = require('./routes/tiendas');
const productos_routes              = require('./routes/productos');
const impuestos_routes              = require('./routes/impuestos');
const categorias_productos_routes   = require('./routes/categorias_productos');
const zonas_routes                  = require('./routes/zonas_envios');
const pedidos_productos_routes      = require('./routes/pedidos_productos');
const meta_pedidos_productos_routes      = require('./routes/metapedidosproductos');
const suscripciones_routes      = require('./routes/suscripciones');
const reglas_descuento_routes      = require('./routes/reglas_descuento');
const cupones_routes      = require('./routes/cupones');
const fidelizacion_clientes_routes      = require('./routes/fidelizacion_clientes');
const uso_cupones_routes      = require('./routes/uso_cupones_usuarios');
const uso_reglas_descuentos_routes      = require('./routes/uso_cupones_usuarios');
const conteo_fidelizacion_routes      = require('./routes/conteo_fidelizacion_clientes');






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
app.use('/api', categorias_productos_routes);

//Sin probar
app.use('/api', pedidos_routes);
app.use('/api', impuestos_routes);
app.use('/api', metaProductos_routes);
app.use('/api', metaTiendas_routes);
app.use('/api', metaPedidos_routes);
app.use('/api', zonas_routes);
app.use('/api', pedidos_productos_routes);
app.use('/api', meta_pedidos_productos_routes);
app.use('/api', suscripciones_routes);
app.use('/api', reglas_descuento_routes);
app.use('/api', cupones_routes);
app.use('/api', fidelizacion_clientes_routes);
app.use('/api', uso_cupones_routes);
app.use('/api', uso_reglas_descuentos_routes);
app.use('/api', conteo_fidelizacion_routes);

//Corriendo servidor
app.listen(config.PORT, () => {
    console.log('Servidor corriendo exitosamente'+ config.PORT);
})

//Exportar modulo
module.exports = app;

