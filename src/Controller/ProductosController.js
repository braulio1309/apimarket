//Librerías y servicios
const validator = require('validator');
const PRODUCTOS = require('../Models/Productos');
const TIENDAS = require('../Models/Tiendas');

const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const productos = {
    
    crear: async function(req, res){
        let params = req.body;

        const id = req.params.idtienda;
        //Validar datos
        params.DES_NOMBRE_PRODUCTO       = (params.DES_NOMBRE_PRODUCTO == undefined)?'':params.DES_NOMBRE_PRODUCTO;
        params.DES_SLUG_PRODUCTO         = (params.DES_SLUG_PRODUCTO == undefined)?'':params.DES_SLUG_PRODUCTO;
        params.NUM_COMISION     = (params.NUM_COMISION == undefined)?'':params.NUM_COMISION;
        params.DES_SKU          = (params.DES_SKU == undefined)?'':params.DES_SKU;
        params.DES_DESCRIPCION_CORTA   = (params.DES_DESCRIPCION_CORTA == undefined)?'':params.DES_DESCRIPCION_CORTA;
        params.DES_DESCRIPCION_LARGA   = (params.DES_DESCRIPCION_LARGA == undefined)?'':params.DES_DESCRIPCION_LARGA;
        params.DES_URL_DESCARGAR    = (params.DES_URL_DESCARGAR == undefined)?'':params.DES_URL_DESCARGAR;
        params.DES_URL_IMAGEN       = (params.DES_URL_IMAGEN == undefined)?'':params.DES_URL_IMAGEN;
        params.NUM_TIPO_PRODUCTO         = (params.NUM_TIPO_PRODUCTO == undefined)?0:params.NUM_TIPO_PRODUCTO;
        params.NUM_PRECIO_VENTA = (params.NUM_PRECIO_VENTA == undefined)?0:params.NUM_PRECIO_VENTA;
        params.NUM_PRECIO_OFERTA= (params.NUM_PRECIO_OFERTA == undefined)?0:params.NUM_PRECIO_OFERTA;
        params.NUM_COMISION     = (params.NUM_COMISION == undefined)?'':params.NUM_COMISION;
        params.JSON_ETIQUETAS    = (params.JSON_ETIQUETAS == undefined)? null :params.JSON_ETIQUETAS;
        params.JSON_URL_GALERIA      = (params.JSON_URL_GALERIA == undefined)?null:params.JSON_URL_GALERIA;
        params.BND_GESTIONAR_INVENTARIO   = (params.BND_GESTIONAR_INVENTARIO == undefined)?0:params.BND_GESTIONAR_INVENTARIO;
        params.BND_VENDER_INDIVIDUALMENTE   = (params.BND_VENDER_INDIVIDUALMENTE == undefined)?0:params.BND_VENDER_INDIVIDUALMENTE;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE_PRODUCTO);
        let validate_slug  = !validator.isEmpty(params.DES_SLUG_PRODUCTO);
        let validate_comision  = !validator.isEmpty(params.NUM_COMISION);
        let validate_sku   = !validator.isEmpty(params.DES_SKU);
        let validate_descripcion_corta  = !validator.isEmpty(params.DES_DESCRIPCION_CORTA);
        let validate_descripcion_larga  = !validator.isEmpty(params.DES_DESCRIPCION_LARGA);
        let validate_descargar   = !validator.isEmpty(params.DES_URL_DESCARGAR);
        let validate_imagen   = !validator.isEmpty(params.DES_URL_IMAGEN);
       

        if(validate_nombre && validate_slug){

            //Valido si la tienda existe
            const tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el DES_SLUG_PRODUCTO no esté tomado 
            const slug_product = await pool.query(consulta.search(PRODUCTOS.TABLA, PRODUCTOS.DES_SLUG_PRODUCTO, params.DES_SLUG_PRODUCTO, 'equals' ));
            if(slug_product.length > 0){
                return res.status(400).send({
                    'message': 'El DES_SLUG_PRODUCTO ya fue tomado '
                });
            }

            //Guardar en la base de datos
            const data = {
                ID_TIENDA: id,
                DES_SLUG_PRODUCTO:params.DES_SLUG_PRODUCTO,
                DES_SKU:params.DES_SKU,
                DES_NOMBRE_PRODUCTO:params.DES_NOMBRE_PRODUCTO,
                DES_DESCRIPCION_CORTA:params.DES_DESCRIPCION_CORTA, 
                DES_DESCRIPCION_LARGA: params.DES_DESCRIPCION_LARGA,
                DES_URL_DESCARGAR:params.DES_URL_DESCARGAR, 
                DES_URL_IMAGEN: params.DES_URL_IMAGEN,
                NUM_TIPO_PRODUCTO: parseInt(params.NUM_TIPO_PRODUCTO),
                NUM_PRECIO_VENTA: parseFloat(params.NUM_PRECIO_VENTA),
                NUM_PRECIO_OFERTA: parseFloat(params.NUM_PRECIO_OFERTA), 
                NUM_COMISION: params.NUM_COMISION,
                JSON_ETIQUETAS: params.JSON_ETIQUETAS,
                JSON_URL_GALERIA: params.JSON_URL_GALERIA,
                BND_GESTIONAR_INVENTARIO: params.BND_GESTIONAR_INVENTARIO,
                BND_VENDER_INDIVIDUALMENTE: params.BND_VENDER_INDIVIDUALMENTE,
                FECHA: date,
                ESTATUS: 1
            }

            consulta.funciones.insertTable(PRODUCTOS.TABLA, data);

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
         let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM productos', null)
        

         return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('productos', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.DES_NOMBRE_PRODUCTO       = (params.DES_NOMBRE_PRODUCTO == undefined)?'':params.DES_NOMBRE_PRODUCTO;
        params.DES_SLUG_PRODUCTO         = (params.DES_SLUG_PRODUCTO == undefined)?'':params.DES_SLUG_PRODUCTO;
        params.NUM_COMISION     = (params.NUM_COMISION == undefined)?0:params.NUM_COMISION;
        params.DES_SKU          = (params.DES_SKU == undefined)?'':params.DES_SKU;
        params.DES_DESCRIPCION_CORTA   = (params.DES_DESCRIPCION_CORTA == undefined)?'':params.DES_DESCRIPCION_CORTA;
        params.DES_DESCRIPCION_LARGA   = (params.DES_DESCRIPCION_LARGA == undefined)?'':params.DES_DESCRIPCION_LARGA;
        params.DES_URL_DESCARGAR    = (params.DES_URL_DESCARGAR == undefined)?'':params.DES_URL_DESCARGAR;
        params.DES_URL_IMAGEN       = (params.DES_URL_IMAGEN == undefined)?'':params.DES_URL_IMAGEN;
        params.NUM_TIPO_PRODUCTO         = (params.NUM_TIPO_PRODUCTO == undefined)?0:params.NUM_TIPO_PRODUCTO;
        params.NUM_PRECIO_VENTA = (params.NUM_PRECIO_VENTA == undefined)?0:params.NUM_PRECIO_VENTA;
        params.NUM_PRECIO_OFERTA= (params.NUM_PRECIO_OFERTA == undefined)?0:params.NUM_PRECIO_OFERTA;
        params.NUM_COMISION     = (params.NUM_COMISION == undefined)?'':params.NUM_COMISION;
        params.JSON_ETIQUETAS    = (params.JSON_ETIQUETAS == undefined)? null :params.JSON_ETIQUETAS;
        params.JSON_URL_GALERIA      = (params.JSON_URL_GALERIA == undefined)?null:params.JSON_URL_GALERIA;
        params.BND_GESTIONAR_INVENTARIO   = (params.BND_GESTIONAR_INVENTARIO == undefined)?0:params.BND_GESTIONAR_INVENTARIO;
        params.BND_VENDER_INDIVIDUALMENTE   = (params.BND_VENDER_INDIVIDUALMENTE == undefined)?0:params.BND_VENDER_INDIVIDUALMENTE;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE_PRODUCTO);
        let validate_slug  = !validator.isEmpty(params.DES_SLUG_PRODUCTO);
        let validate_sku   = !validator.isEmpty(params.DES_SKU);
        let validate_descripcion_corta  = !validator.isEmpty(params.DES_DESCRIPCION_CORTA);
        let validate_descripcion_larga  = !validator.isEmpty(params.DES_DESCRIPCION_LARGA);
        let validate_imagen   = !validator.isEmpty(params.DES_URL_IMAGEN);
        let validate_estatus   = !validator.isEmpty(params.ESTATUS);

        if(validate_nombre || validate_slug || validate_estatus){

            //Valido si la tienda existe
            const tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el DES_SLUG_PRODUCTO no esté tomado 
            const slug_product = await pool.query(consulta.search(PRODUCTOS.TABLA, PRODUCTOS.DES_SLUG_PRODUCTO, params.DES_SLUG_PRODUCTO, 'equals' ));
            if(slug_product.length > 0){
                return res.status(400).send({
                    'message': 'El DES_SLUG_PRODUCTO ya fue tomado '
                });
            }

            //Valido que exista el producto
            let produc = await pool.query(consulta.get(PRODUCTOS.TABLA, id))
            if(produc.length == 0){
                return res.status(400).send({
                    'message': 'El producto no existe '
                });
            }
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                ID_TIENDA: produc.ID_TIENDA,
                DES_SLUG_PRODUCTO:(params.DES_SLUG_PRODUCTO == '')?produc.DES_SLUG_PRODUCTO:params.DES_SLUG_PRODUCTO,
                DES_SKU:(params.DES_SKU == '')?produc.DES_SKU_PRODUCTO:params.DES_SKU,
                DES_NOMBRE_PRODUCTO:(params.DES_NOMBRE_PRODUCTO == '')?produc.DES_NOMBRE_PRODUCTO:params.DES_NOMBRE_PRODUCTO,
                DES_DESCRIPCION_CORTA:(params.DES_DESCRIPCION_CORTA == '')?produc.DES_DESCRIPCION_CORTA:params.DES_SLUG_PRODUCTO, 
                DES_DESCRIPCION_LARGA: (params.DES_DESCRIPCION_LARGA == '')?produc.DES_DESCRIPCION_LARGA:params.DES_DESCRIPCION_LARGA,
                DES_URL_DESCARGAR:(params.DES_URL_DESCARGAR == '')?produc.DES_URL_DESCARGAR:params.DES_URL_DESCARGAR, 
                DES_URL_IMAGEN: (params.DES_URL_IMAGEN == '')?produc.DES_URL_IMAGEN:params.DES_URL_IMAGEN,
                NUM_TIPO_PRODUCTO: (params.NUM_TIPO_PRODUCTO == 0)?produc.NUM_TIPO_PRODUCTO:parseInt(params.NUM_TIPO_PRODUCTO),
                NUM_PRECIO_VENTA: (params.NUM_PRECIO_VENTA == 0)?produc.NUM_PRECIO_VENTA:parseFloat(params.NUM_PRECIO_VENTA),
                NUM_PRECIO_OFERTA: (params.NUM_PRECIO_OFERTA == 0)?produc.NUM_PRECIO_OFERTA:parseFloat(params.NUM_PRECIO_OFERTA), 
                NUM_COMISION: (params.DES_SLUG_PRODUCTO == 0)?produc.NUM_COMISION:parseInt(params.NUM_COMISION),
                JSON_ETIQUETAS: (params.JSON_ETIQUETAS == null)?produc.JSON_ETIQUETAS:params.JSON_ETIQUETAS,
                JSON_URL_GALERIA: (params.JSON_URL_GALERIA == null)?produc.JSON_URL_GALERIA:params.JSON_URL_GALERIA,
                BND_GESTIONAR_INVENTARIO: (params.BND_GESTIONAR_INVENTARIO == 0)?produc.BND_GESTIONAR_INVENTARIO:parseInt(params.BND_GESTIONAR_INVENTARIO),
                BND_VENDER_INDIVIDUALMENTE: (params.BND_VENDER_INDIVIDUALMENTE == 0)?produc.BND_VENDER_INDIVIDUALMENTE:parseInt(params.BND_VENDER_INDIVIDUALMENTE),
                FECHA: produc.FECHA,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
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
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(PRODUCTOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Producto eliminado exitosamente',
         
        });
    }
}

module.exports = productos