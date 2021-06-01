//Librerías y servicios
const validator = require('validator');
const PRODUCTOS = require('../Models/Productos');
const PEDIDOS = require('../Models/Pedidos');
const SUSCRIPCIONES = require('../Models/Suscripciones');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const productos = {
    
    crear: async function(req, res){
        let params = req.body;

        //Validar datos
        params.ID_PRODUCTO       = (params.ID_PRODUCTO == undefined)?null:params.ID_PRODUCTO;
        params.ID_PEDIDO         = (params.ID_PEDIDO == undefined)?null:params.ID_PEDIDO;
        params.NUM_TIPO_FRECUENCIA_PAGO     = (params.NUM_TIPO_FRECUENCIA_PAGO == undefined)?'':params.NUM_TIPO_FRECUENCIA_PAGO;
        params.NUM_FRECUENCIA_PAGO          = (params.NUM_FRECUENCIA_PAGO == undefined)?'':params.NUM_FRECUENCIA_PAGO;
        params.JSON_NOTAS   = (params.JSON_NOTAS == undefined)?'':params.JSON_NOTAS;
        params.FECHA_INICIO   = (params.FECHA_INICIO == undefined)?'':params.FECHA_INICIO;
        params.FECHA_SIGUIENTE_PAGO    = (params.FECHA_SIGUIENTE_PAGO == undefined)?'':params.FECHA_SIGUIENTE_PAGO;
        params.FECHA_FIN       = (params.FECHA_FIN == undefined)?'':params.FECHA_FIN;
       


        if(params.ID_PRODUCTO && params.ID_PEDIDO){

            //Valido si la tienda existe
            const producto = await pool.query(consulta.get(PRODUCTOS.TABLA, params.ID_PRODUCTO));
            if(producto.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA,  params.ID_PEDIDO));
            if(pedido.length == 0){
                return res.status(400).send({
                    'message': 'Pedido no existe'
                });
            }


            //Guardar en la base de datos
            const data = {
                ID_USUARIO: req.user.sub,
                ID_PRODUCTO: params.ID_PRODUCTO,
                ID_PEDIDO: params.ID_PEDIDO,
                NUM_TIPO_FRECUENCIA_PAGO: parseInt(params.NUM_TIPO_FRECUENCIA_PAGO),
                NUM_FRECUENCIA_PAGO: parseInt(params.NUM_FRECUENCIA_PAGO),
                JSON_NOTAS: JSON.stringify(params.JSON_NOTAS),
                FECHA_INICIO: params.FECHA_INICIO,
                FECHA_SIGUIENTE_PAGO: params.FECHA_SIGUIENTE_PAGO,
                FECHA_FIN: params.FECHA_FIN,
                ESTATUS: 1
            }

            try{
                consulta.funciones.insertTable(SUSCRIPCIONES.TABLA, data);

            }catch(e){
                return res.status(200).send({
                    'message': 'Producto registrado con exito',
                    'producto': data
                }); 
            }

            return res.status(200).send({
                'message': 'Producto registrado con exito',
                'producto': data
            }); 



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    mostrar:async function(req, res){
         //let user =  await pool.query(consulta.list('DES_USUARIOs'))
         let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM suscripciones', null)
        

         return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('suscripciones', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const ID_USUARIO = req.params.ID_USUARIO
        const ID_PRODUCTO = req.params.ID_PRODUCTO
        const ID_PEDIDO = req.params.ID_PEDIDO

         //Validar datos
        
         params.NUM_TIPO_FRECUENCIA_PAGO     = (params.NUM_TIPO_FRECUENCIA_PAGO == undefined)?0:params.NUM_TIPO_FRECUENCIA_PAGO;
         params.NUM_FRECUENCIA_PAGO          = (params.NUM_FRECUENCIA_PAGO == undefined)?0:params.NUM_FRECUENCIA_PAGO;
         params.JSON_NOTAS   = (params.JSON_NOTAS == undefined)?null:params.JSON_NOTAS;
         params.FECHA_INICIO   = (params.FECHA_INICIO == undefined)?null:params.FECHA_INICIO;
         params.FECHA_SIGUIENTE_PAGO    = (params.FECHA_SIGUIENTE_PAGO == undefined)?null:params.FECHA_SIGUIENTE_PAGO;
         params.FECHA_FIN       = (params.FECHA_FIN == undefined)?null:params.FECHA_FIN;
         params.ESTATUS       = (params.ESTATUS == undefined)?'':params.ESTATUS;

        if(params.NUM_TIPO_FRECUENCIA_PAGO || params.NUM_FRECUENCIA_PAGO || params.JSON_NOTAS || params.FECHA_INICIO || params.FECHA_SIGUIENTE_PAGO
            || params.FECHA_FIN ||  params.ESTATUS){

            //Valido si la tienda existe
            const producto = await pool.query(consulta.get(PRODUCTOS.TABLA, ID_PRODUCTO));
            if(producto.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA,  ID_PEDIDO));
            if(pedido.length == 0){
                return res.status(400).send({
                    'message': 'Pedido no existe'
                });
            }

            let produc = await pool.query(consulta.custom(`SELECT * FROM suscripciones wHERE ID_PEDIDO = ${ID_PEDIDO} AND 
            ID_USUARIO = ${ID_USUARIO} AND ID_PRODUCTO = ${ID_PRODUCTO}`))
            if(produc.length == 0){
                return res.status(400).send({
                    'message': 'Pedido no existe'
                });
            }
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID_PRODUCTO: ID_PRODUCTO,
                ID_USUARIO:ID_USUARIO,
                ID_PEDIDO: ID_PEDIDO,
                NUM_TIPO_FRECUENCIA_PAGO:(params.NUM_TIPO_FRECUENCIA_PAGO == '')?produc.NUM_TIPO_FRECUENCIA_PAGO:params.NUM_TIPO_FRECUENCIA_PAGO,
                NUM_FRECUENCIA_PAGO:(params.NUM_FRECUENCIA_PAGO == '')?produc.NUM_FRECUENCIA_PAGO:params.NUM_FRECUENCIA_PAGO, 
              //  JSON_FRECUENCIA_PAGO: (params.JSON_FRECUENCIA_PAGO == '')?produc.JSON_FRECUENCIA_PAGO:params.JSON_FRECUENCIA_PAGO,
                FECHA_INICIO:(params.FECHA_INICIO == '')?produc.FECHA_INICIO:params.FECHA_INICIO, 
                FECHA_FIN: (params.FECHA_FIN == '')?produc.FECHA_FIN:params.FECHA_FIN,
                FECHA_SIGUIENTE_PAGO: (params.FECHA_SIGUIENTE_PAGO == '')?produc.FECHA_SIGUIENTE_PAGO:params.FECHA_SIGUIENTE_PAGO,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
            }

            try{
               
                await pool.query(consulta.custom(`UPDATE suscripciones
                SET ID_PRODUCTO=${ID_PRODUCTO}, ID_USUARIO=${ID_USUARIO}, ID_PEDIDO=${ID_PEDIDO}, 
                NUM_TIPO_FRECUENCIA_PAGO = ${data.NUM_TIPO_FRECUENCIA_PAGO}, NUM_FRECUENCIA_PAGO = ${data.NUM_FRECUENCIA_PAGO},
                FECHA_INICIO = '${data.FECHA_INICIO}', FECHA_FIN = '${data.FECHA_FIN}', FECHA_SIGUIENTE_PAGO = '${data.FECHA_SIGUIENTE_PAGO}', ESTATUS= ${data.ESTATUS}
                WHERE ID_USUARIO = ${ID_USUARIO} AND ID_PRODUCTO = ${ID_PRODUCTO} AND ID_PEDIDO = ${ID_PEDIDO}`));

            }catch(e){
                return res.status(400).send({
                    'message': 'Error al insertar'
                }); 
            }
           
            return res.status(200).send({
                'message': 'Producto actualizado con exito',
                'producto': data
            }); 



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    delete:async function(req, res) {

        const ID_USUARIO = req.params.ID_USUARIO
        const ID_PRODUCTO = req.params.ID_PRODUCTO
        const ID_PEDIDO = req.params.ID_PEDIDO
        
        const borrar = await pool.query(consulta.custom(`DELETE FROM suscripciones WHERE ID_USUARIO = ${ID_USUARIO} 
        AND ID_PRODUCTO = ${ID_PRODUCTO} AND ID_PEDIDO = ${ID_PEDIDO}`));
        return res.status(200).send({
            'message': 'Cupón eliminado exitosamente',
         
        });
    }

    
}

module.exports = productos