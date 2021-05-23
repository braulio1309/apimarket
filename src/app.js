
//Requires
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../database');
const config = require('./database/config');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const dotenv = require("dotenv");
dotenv.config();


//Ejecutar express
const app = express();

app.use(passport.initialize());
app.use(passport.session())

//FACEBOOK LOGIN
 
passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["email", "name"]
      },
      function(accessToken, refreshToken, profile, done) {
        const { email, first_name, last_name } = profile._json;
        const userData = {
          email,
          firstName: first_name,
          lastName: last_name
        };
        //new userModel(userData).save();
        done(null, profile);
      }
    )
)

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
const meta_variables_routes      = require('./routes/metavariables');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());


//Reescribir rutas
app.use('', usuario_routes);
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
app.use('/api', meta_variables_routes);

//Corriendo servidor
console.log(process.env.PORT)
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo exitosamente'+ process.env.PORT);
})

//Exportar modulo
module.exports = app;

