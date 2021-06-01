//Librerías y servicios
const validator = require('validator');
const CUPONES = require('../Models/Cupones');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const cupones = {
    
    crear: async function(req, res){
        let params = req.body;

      
        //Validar datos
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_DESCRIPCION         = (params.DES_DESCRIPCION == undefined)?'':params.DES_DESCRIPCION;
        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.FECHA_CADUCIDAD          = (params.FECHA_CADUCIDAD == undefined)?'':params.FECHA_CADUCIDAD;
        params.BDN_ENVIO_GRATUITO   = (params.BDN_ENVIO_GRATUITO == undefined)?null:params.BDN_ENVIO_GRATUITO;
        params.NUM_GASTO_MINIMO   = (params.NUM_GASTO_MINIMO == undefined)?null:params.NUM_GASTO_MINIMO;
        params.NUM_GASTO_MAXIMO    = (params.NUM_GASTO_MAXIMO == undefined)?null:params.NUM_GASTO_MAXIMO;
        params.BND_USO_INDIVIDUAL       = (params.BND_USO_INDIVIDUAL == undefined)?0:params.BND_USO_INDIVIDUAL;
        params.BND_EXCLUYE_ARTICULOS_OFERTA         = (params.BND_EXCLUYE_ARTICULOS_OFERTA == undefined)?null:params.BND_EXCLUYE_ARTICULOS_OFERTA;
        params.JSON_ID_PRODUCTOS_INCLUIDOS = (params.JSON_ID_PRODUCTOS_INCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_INCLUIDOS;
        params.JSON_ID_CATEGORIAS_INCLUIDAS= (params.JSON_ID_CATEGORIAS_INCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_INCLUIDAS;
        params.JSON_ID_TIENDAS_INCLUIDAS     = (params.JSON_ID_TIENDAS_INCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_INCLUIDAS;
        params.JSON_ID_USUARIOS_INCLUIDOS    = (params.JSON_ETIQUETAS == undefined)? null :params.JSON_ETIQUETAS;
        params.JSON_ID_PRODUCTOS_EXCLUIDOS      = (params.JSON_ID_PRODUCTOS_EXCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_EXCLUIDOS;
        params.JSON_ID_ROLES_EXCLUIDOS   = (params.JSON_ID_ROLES_EXCLUIDOS == undefined)?null:params.JSON_ID_ROLES_EXCLUIDOS;
        params.NUM_LIMITE_USO_POR_CUPON   = (params.NUM_LIMITE_USO_POR_CUPON == undefined)?null:params.NUM_LIMITE_USO_POR_CUPON;
        params.NUM_LIMITE_USO_POR_USUARIO   = (params.NUM_LIMITE_USO_POR_USUARIO == undefined)?null:params.NUM_LIMITE_USO_POR_USUARIO;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.DES_DESCRIPCION);

        if(validate_nombre && validate_slug){


            //Valido que el DES_DESCRIPCION no esté tomado 
            const nombre = await pool.query(consulta.search(CUPONES.TABLA, CUPONES.DES_NOMBRE, params.DES_NOMBRE, 'equals' ));
            if(nombre.length > 0){
                return res.status(400).send({
                    'message': 'El nombre ya fue tomado '
                });
            }

            //Guardar en la base de datos
            const data = {
               
                DES_DESCRIPCION:params.DES_DESCRIPCION,
                FECHA_CADUCIDAD:params.FECHA_CADUCIDAD,
                DES_NOMBRE:params.DES_NOMBRE,
                BDN_ENVIO_GRATUITO: parseInt(params.BDN_ENVIO_GRATUITO), 
                NUM_GASTO_MINIMO: parseFloat(params.NUM_GASTO_MINIMO),
                NUM_GASTO_MAXIMO: parseFloat(params.NUM_GASTO_MAXIMO), 
                BND_USO_INDIVIDUAL: parseInt(params.BND_USO_INDIVIDUAL),
                BND_EXCLUYE_ARTICULOS_OFERTA: parseInt(params.BND_EXCLUYE_ARTICULOS_OFERTA),
                JSON_ID_PRODUCTOS_INCLUIDOS: JSON.stringify(params.JSON_ID_PRODUCTOS_INCLUIDOS),
                JSON_ID_CATEGORIAS_INCLUIDAS: JSON.stringify(params.JSON_ID_CATEGORIAS_INCLUIDAS), 
                NUM_IMPORTE: parseFloat(params.NUM_IMPORTE),
                JSON_ID_PRODUCTOS_EXCLUIDOS: params.JSON_ID_PRODUCTOS_EXCLUIDOS,
                JSON_ID_ROLES_EXCLUIDOS: JSON.stringify(params.JSON_ID_ROLES_EXCLUIDOS),
                NUM_LIMITE_USO_POR_CUPON: parseInt(params.NUM_LIMITE_USO_POR_CUPON),
                NUM_LIMITE_USO_POR_USUARIO: parseInt(params.NUM_LIMITE_USO_POR_USUARIO),
                 
                FECHA: date,
                ESTATUS: 1
            }
            //console.log(data)

            try{
                consulta.funciones.insertTable(CUPONES.TABLA, data);

            }catch(e){
                return res.status(400).send({
                    'message': 'Error de inserción'
                });
            }

            return res.status(200).send({
                'message': 'Cupón registrado con exito',
                'producto': data
            }); 



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    mostrar:async function(req, res){
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM cupones', null)
        

         return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('cupones', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_DESCRIPCION         = (params.DES_DESCRIPCION == undefined)?'':params.DES_DESCRIPCION;
        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.FECHA_CADUCIDAD          = (params.FECHA_CADUCIDAD == undefined)?'':params.FECHA_CADUCIDAD;
        params.BDN_ENVIO_GRATUITO   = (params.BDN_ENVIO_GRATUITO == undefined)?null:params.BDN_ENVIO_GRATUITO;
        params.NUM_GASTO_MINIMO   = (params.NUM_GASTO_MINIMO == undefined)?null:params.NUM_GASTO_MINIMO;
        params.NUM_GASTO_MAXIMO    = (params.NUM_GASTO_MAXIMO == undefined)?null:params.NUM_GASTO_MAXIMO;
        params.BND_USO_INDIVIDUAL       = (params.BND_USO_INDIVIDUAL == undefined)?null:params.BND_USO_INDIVIDUAL;
        params.BND_EXCLUYE_ARTICULOS_OFERTA         = (params.BND_EXCLUYE_ARTICULOS_OFERTA == undefined)?null:params.BND_EXCLUYE_ARTICULOS_OFERTA;
        params.JSON_ID_PRODUCTOS_INCLUIDOS = (params.JSON_ID_PRODUCTOS_INCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_INCLUIDOS;
        params.JSON_ID_CATEGORIAS_INCLUIDAS= (params.JSON_ID_CATEGORIAS_INCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_INCLUIDAS;
        params.JSON_ID_TIENDAS_INCLUIDAS     = (params.JSON_ID_TIENDAS_INCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_INCLUIDAS;
        params.JSON_ID_USUARIOS_INCLUIDOS    = (params.JSON_ETIQUETAS == undefined)? null :params.JSON_ETIQUETAS;
        params.JSON_ID_PRODUCTOS_EXCLUIDOS      = (params.JSON_ID_PRODUCTOS_EXCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_EXCLUIDOS;
        params.JSON_ID_ROLES_EXCLUIDOS   = (params.JSON_ID_ROLES_EXCLUIDOS == undefined)?null:params.JSON_ID_ROLES_EXCLUIDOS;
        params.NUM_LIMITE_USO_POR_CUPON   = (params.NUM_LIMITE_USO_POR_CUPON == undefined)?null:params.NUM_LIMITE_USO_POR_CUPON;
        params.NUM_LIMITE_USO_POR_USUARIO   = (params.NUM_LIMITE_USO_POR_USUARIO == undefined)?null:params.NUM_LIMITE_USO_POR_USUARIO;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.DES_DESCRIPCION);
        let validate_estatus  = !validator.isEmpty(params.ESTATUS);

        
        if(validate_nombre || validate_slug || validate_estatus || params.NUM_IMPORTE || params.FECHA_CADUCIDAD || params.BDN_ENVIO_GRATUITO || params.NUM_GASTO_MINIMO || params.NUM_GASTO_MAXIMO
            || params.BND_USO_INDIVIDUAL || params.BND_EXCLUYE_ARTICULOS_OFERTA || params.JSON_ID_CATEGORIAS_INCLUIDAS || params.JSON_ID_PRODUCTOS_EXCLUIDOS
            || params.JSON_ID_PRODUCTOS_INCLUIDOS || params.JSON_ID_ROLES_EXCLUIDOS || params.JSON_ID_TIENDAS_INCLUIDAS || params.JSON_ID_USUARIOS_INCLUIDOS){

            //Valido si el cupon existe
            let produc = await pool.query(consulta.get(CUPONES.TABLA, id));
            if(produc.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el DES_DESCRIPCION no esté tomado 
            const nombre = await pool.query(consulta.search(CUPONES.TABLA, CUPONES.DES_DESCRIPCION, params.DES_NOMBRE, 'equals' ));
            if(nombre.length > 1){
                return res.status(400).send({
                    'message': 'El nombre ya fue tomado '
                });
            }

           
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                DES_DESCRIPCION:(params.DES_DESCRIPCION == '')?produc.DES_DESCRIPCION:params.DES_DESCRIPCION,
                FECHA_CADUCIDAD:(params.FECHA_CADUCIDAD == '')?produc.DES_SKU_PRODUCTO:params.FECHA_CADUCIDAD,
                DES_NOMBRE:(params.DES_NOMBRE == '')?produc.DES_NOMBRE:params.DES_NOMBRE,
                BDN_ENVIO_GRATUITO:(params.BDN_ENVIO_GRATUITO == null)?produc.BDN_ENVIO_GRATUITO:parseInt(params.BDN_ENVIO_GRATUITO), 
                NUM_GASTO_MINIMO: (params.NUM_GASTO_MINIMO == null)?produc.NUM_GASTO_MINIMO:parseFloat(params.NUM_GASTO_MINIMO),
                NUM_GASTO_MAXIMO:(params.NUM_GASTO_MAXIMO == null)?produc.NUM_GASTO_MAXIMO:parseFloat(params.NUM_GASTO_MAXIMO), 
                BND_USO_INDIVIDUAL: (params.BND_USO_INDIVIDUAL == null)?produc.BND_USO_INDIVIDUAL:parseInt(params.BND_USO_INDIVIDUAL),
                BND_EXCLUYE_ARTICULOS_OFERTA: (params.BND_EXCLUYE_ARTICULOS_OFERTA == null)?produc.BND_EXCLUYE_ARTICULOS_OFERTA:parseInt(params.BND_EXCLUYE_ARTICULOS_OFERTA),
                JSON_ID_PRODUCTOS_INCLUIDOS: (params.JSON_ID_PRODUCTOS_INCLUIDOS == null)? produc.JSON_ID_PRODUCTOS_INCLUIDOS:JSON.stringify(params.JSON_ID_PRODUCTOS_INCLUIDOS),
                JSON_ID_CATEGORIAS_INCLUIDAS: (params.JSON_ID_CATEGORIAS_INCLUIDAS == null)?produc.JSON_ID_CATEGORIAS_INCLUIDAS:JSON.stringify(params.JSON_ID_CATEGORIAS_INCLUIDAS), 
                NUM_IMPORTE: (params.NUM_IMPORTE == null)?produc.NUM_IMPORTE:parseFloat(params.NUM_IMPORTE),
                JSON_ID_PRODUCTOS_EXCLUIDOS: (params.JSON_ID_PRODUCTOS_EXCLUIDOS == null)?produc.JSON_ID_PRODUCTOS_EXCLUIDOS:JSON.stringify(params.JSON_ID_PRODUCTOS_EXCLUIDOS),
                JSON_ID_ROLES_EXCLUIDOS: (params.JSON_ID_ROLES_EXCLUIDOS == null)?produc.JSON_ID_ROLES_EXCLUIDOS:JSON.stringify(params.JSON_ID_ROLES_EXCLUIDOS),
                NUM_LIMITE_USO_POR_CUPON: (params.NUM_LIMITE_USO_POR_CUPON == null)?produc.NUM_LIMITE_USO_POR_CUPON:parseInt(params.NUM_LIMITE_USO_POR_CUPON),
                NUM_LIMITE_USO_POR_USUARIO: (params.NUM_LIMITE_USO_POR_USUARIO == null)?produc.NUM_LIMITE_USO_POR_USUARIO:parseInt(params.NUM_LIMITE_USO_POR_USUARIO),
                FECHA: produc.FECHA,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
            }

            try{
                consulta.funciones.update(CUPONES.TABLA, data);

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
        const borrar = await pool.query(consulta.remove(CUPONES.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Cupón eliminado exitosamente',
         
        });
    }
}

module.exports = cupones