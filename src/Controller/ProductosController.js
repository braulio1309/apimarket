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
        params.nombre       = (params.nombre == undefined)?'':params.nombre;
        params.slug         = (params.slug == undefined)?'':params.slug;
        params.comision     = (params.comision == undefined)?'':params.comision;
        params.sku          = (params.sku == undefined)?'':params.sku;
        params.descripcion_corta   = (params.descripcion_corta == undefined)?'':params.descripcion_corta;
        params.descripcion_larga   = (params.descripcion_larga == undefined)?'':params.descripcion_larga;
        params.descargar    = (params.descargar == undefined)?'':params.descargar;
        params.imagen       = (params.imagen == undefined)?'':params.imagen;
        params.tipo         = (params.tipo == undefined)?0:params.tipo;
        params.precio_venta = (params.precio_venta == undefined)?0:params.precio_venta;
        params.precio_oferta= (params.precio_oferta == undefined)?0:params.precio_oferta;
        params.comision     = (params.comision == undefined)?'':params.comision;
        params.etiquetas    = (params.etiquetas == undefined)? null :params.etiquetas;
        params.galeria      = (params.galeria == undefined)?null:params.galeria;
        params.inventario   = (params.inventario == undefined)?0:params.inventario;
        params.vender_individualmente   = (params.vender_individualmente == undefined)?0:params.vender_individualmente;

        let validate_nombre   = !validator.isEmpty(params.nombre);
        let validate_slug  = !validator.isEmpty(params.slug);
        let validate_comision  = !validator.isEmpty(params.comision);
        let validate_sku   = !validator.isEmpty(params.sku);
        let validate_descripcion_corta  = !validator.isEmpty(params.descripcion_corta);
        let validate_descripcion_larga  = !validator.isEmpty(params.descripcion_larga);
        let validate_descargar   = !validator.isEmpty(params.descargar);
        let validate_imagen   = !validator.isEmpty(params.imagen);
       

        if(validate_nombre && validate_slug){

            //Valido si la tienda existe
            const tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el slug no esté tomado 
            const slug_product = await pool.query(consulta.search(PRODUCTOS.TABLA, PRODUCTOS.SLUG, params.slug, 'equals' ));
            if(slug_product.length > 0){
                return res.status(400).send({
                    'message': 'El slug ya fue tomado '
                });
            }

            //Guardar en la base de datos
            const data = {
                ID_TIENDA: id,
                DES_SLUG_PRODUCTO:params.slug,
                DES_SKU:params.sku,
                DES_NOMBRE_PRODUCTO:params.nombre,
                DES_DESCRIPCION_CORTA:params.descripcion_corta, 
                DES_DESCRIPCION_LARGA: params.descripcion_larga,
                DES_URL_DESCARGAR:params.descargar, 
                DES_URL_IMAGEN: params.imagen,
                NUM_TIPO_PRODUCTO: parseInt(params.tipo),
                NUM_PRECIO_VENTA: parseFloat(params.precio_venta),
                NUM_PRECIO_OFERTA: parseFloat(params.precio_oferta), 
                NUM_COMISION: params.comision,
                JSON_ETIQUETAS: params.etiquetas,
                JSON_URL_GALERIA: params.galeria,
                BND_GESTIONAR_INVENTARIO: params.inventario,
                BND_VENDER_INDIVIDUALMENTE: params.vender_individualmente,
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
        const lista = await pool.query(consulta.list(PRODUCTOS.TABLA));
        return res.status(400).send({
            'lista': lista
        });
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.nombre       = (params.nombre == undefined)?'':params.nombre;
        params.slug         = (params.slug == undefined)?'':params.slug;
        params.comision     = (params.comision == undefined)?0:params.comision;
        params.sku          = (params.sku == undefined)?'':params.sku;
        params.descripcion_corta   = (params.descripcion_corta == undefined)?'':params.descripcion_corta;
        params.descripcion_larga   = (params.descripcion_larga == undefined)?'':params.descripcion_larga;
        params.descargar    = (params.descargar == undefined)?'':params.descargar;
        params.imagen       = (params.imagen == undefined)?'':params.imagen;
        params.tipo         = (params.tipo == undefined)?0:params.tipo;
        params.precio_venta = (params.precio_venta == undefined)?0:params.precio_venta;
        params.precio_oferta= (params.precio_oferta == undefined)?0:params.precio_oferta;
        params.comision     = (params.comision == undefined)?'':params.comision;
        params.etiquetas    = (params.etiquetas == undefined)? null :params.etiquetas;
        params.galeria      = (params.galeria == undefined)?null:params.galeria;
        params.inventario   = (params.inventario == undefined)?0:params.inventario;
        params.vender_individualmente   = (params.vender_individualmente == undefined)?0:params.vender_individualmente;
        params.estatus   = (params.estatus == undefined)?'':params.estatus;

        let validate_nombre   = !validator.isEmpty(params.nombre);
        let validate_slug  = !validator.isEmpty(params.slug);
        let validate_sku   = !validator.isEmpty(params.sku);
        let validate_descripcion_corta  = !validator.isEmpty(params.descripcion_corta);
        let validate_descripcion_larga  = !validator.isEmpty(params.descripcion_larga);
        let validate_imagen   = !validator.isEmpty(params.imagen);
        let validate_estatus   = !validator.isEmpty(params.estatus);

        if(validate_nombre || validate_slug || validate_estatus){

            //Valido si la tienda existe
            const tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el slug no esté tomado 
            const slug_product = await pool.query(consulta.search(PRODUCTOS.TABLA, PRODUCTOS.SLUG, params.slug, 'equals' ));
            if(slug_product.length > 0){
                return res.status(400).send({
                    'message': 'El slug ya fue tomado '
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
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(PRODUCTOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Producto eliminado exitosamente',
         
        });
    }
}

module.exports = productos