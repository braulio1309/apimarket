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
       


        if(params.ID_PRODUCTO && params.ID_USUARIO){

            //Valido si la tienda existe
            const producto = await pool.query(consulta.get(PRODUCTOS.TABLA, params.ID_PRODUCTO));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA,  params.ID_PEDIDO));
            if(tienda.length == 0){
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
                JSON_NOTAS: params.JSON_NOTAS,
                FECHA_INICIO: params.FECHA_INICIO,
                FECHA_SIGUIENTE_PAGO: params.FECHA_SIGUIENTE_PAGO,
                FECHA_FIN: params.FECHA_FIN,
                ESTATUS: params.ESTATUS,
                FECHA: date,
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

           



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    mostrar:async function(req, res){
        const lista = await pool.query(consulta.list(SUSCRIPCIONES.TABLA));
        return res.status(400).send({
            'lista': lista
        });
    },

    /*update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
         //Validar datos
         params.ID_PRODUCTO       = (params.ID_PRODUCTO == undefined)?null:params.ID_PRODUCTO;
         params.ID_PEDIDO         = (params.ID_PEDIDO == undefined)?null:params.ID_PEDIDO;
         params.NUM_TIPO_FRECUENCIA_PAGO     = (params.NUM_TIPO_FRECUENCIA_PAGO == undefined)?0:params.NUM_TIPO_FRECUENCIA_PAGO;
         params.NUM_FRECUENCIA_PAGO          = (params.NUM_FRECUENCIA_PAGO == undefined)?0:params.NUM_FRECUENCIA_PAGO;
         params.JSON_NOTAS   = (params.JSON_NOTAS == undefined)?null:params.JSON_NOTAS;
         params.FECHA_INICIO   = (params.FECHA_INICIO == undefined)?null:params.FECHA_INICIO;
         params.FECHA_SIGUIENTE_PAGO    = (params.FECHA_SIGUIENTE_PAGO == undefined)?null:params.FECHA_SIGUIENTE_PAGO;
         params.FECHA_FIN       = (params.FECHA_FIN == undefined)?null:params.FECHA_FIN;
         params.ESTATUS       = (params.ESTATUS == undefined)?'':params.ESTATUS;

      
       

        if(validate_nombre || validate_slug || validate_estatus){

            //Valido si la tienda existe
            const producto = await pool.query(consulta.get(PRODUCTOS.TABLA, params.ID_PRODUCTO));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA,  params.ID_PEDIDO));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Pedido no existe'
                });
            }

            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                ID_TIENDA: produc.ID_TIENDA,
                DES_SLUG_PRODUCTO:(params.slug == '')?produc.DES_SLUG_PRODUCTO:params.slug,
                DES_SKU:(params.sku == '')?produc.DES_SKU_PRODUCTO:params.sku,
                DES_NOMBRE_PRODUCTO:(params.nombre == '')?produc.DES_NOMBRE_PRODUCTO:params.nombre,
                DES_DESCRIPCION_CORTA:(params.descripcion_corta == '')?produc.DES_DESCRIPCION_CORTA:params.slug, 
                DES_DESCRIPCION_LARGA: (params.descripcion_larga == '')?produc.DES_DESCRIPCION_LARGA:params.DES_DESCRIPCION_LARGA,
                DES_URL_DESCARGAR:(params.descargar == '')?produc.DES_URL_DESCARGAR:params.descargar, 
                DES_URL_IMAGEN: (params.imagen == '')?produc.DES_URL_IMAGEN:params.imagen,
                NUM_TIPO_PRODUCTO: (params.tipo == 0)?produc.NUM_TIPO_PRODUCTO:parseInt(params.tipo),
                NUM_PRECIO_VENTA: (params.precio_venta == 0)?produc.NUM_PRECIO_VENTA:parseFloat(params.precio_venta),
                NUM_PRECIO_OFERTA: (params.precio_oferta == 0)?produc.NUM_PRECIO_OFERTA:parseFloat(params.precio_oferta), 
                NUM_COMISION: (params.slug == 0)?produc.NUM_COMISION:parseInt(params.comision),
                JSON_ETIQUETAS: (params.etiquetas == null)?produc.JSON_ETIQUETAS:params.etiquetas,
                JSON_URL_GALERIA: (params.galeria == null)?produc.JSON_URL_GALERIA:params.galeria,
                BND_GESTIONAR_INVENTARIO: (params.inventario == 0)?produc.BND_GESTIONAR_INVENTARIO:parseInt(params.inventario),
                BND_VENDER_INDIVIDUALMENTE: (params.vender_individualmente == 0)?produc.BND_VENDER_INDIVIDUALMENTE:parseInt(params.vender_individualmente),
                FECHA: produc.FECHA,
                ESTATUS:  (params.estatus == '')?produc.ESTATUS:params.estatus
            }

            consulta.funciones.update(PRODUCTOS.TABLA, data);

            return res.status(200).send({
                'message': 'Producto actualizado con exito',
                'producto': data
            }); 



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },*/

    
}

module.exports = productos