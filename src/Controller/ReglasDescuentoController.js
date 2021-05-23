//Librerías y servicios
const validator = require('validator');
const REGLAS = require('../Models/Reglas_descuento');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const reglas = {
    
    crear: async function(req, res){
        let params = req.body;

      
        //Validar datos
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_DESCRIPCION         = (params.DES_DESCRIPCION == undefined)?'':params.DES_DESCRIPCION;
        params.FECHA_INICIO         = (params.FECHA_INICIO == undefined)?'':params.FECHA_INICIO;
        params.FECHA_FIN         = (params.FECHA_FIN == undefined)?'':params.FECHA_FIN;

        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.NUM_TIPO_REGLA          = (params.NUM_TIPO_REGLA == undefined)?'':params.NUM_TIPO_REGLA;
        params.BDN_ENVIO_GRATUITO   = (params.BDN_ENVIO_GRATUITO == undefined)?null:params.BDN_ENVIO_GRATUITO;
        params.NUM_GASTO_MINIMO   = (params.NUM_GASTO_MINIMO == undefined)?null:params.NUM_GASTO_MINIMO;
        params.NUM_GASTO_MAXIMO    = (params.NUM_GASTO_MAXIMO == undefined)?null:params.NUM_GASTO_MAXIMO;
        params.BND_USO_INDIVIDUAL       = (params.BND_USO_INDIVIDUAL == undefined)?null:params.BND_USO_INDIVIDUAL;
        params.BND_EXCLUYE_ARTICULOS_OFERTA         = (params.BND_EXCLUYE_ARTICULOS_OFERTA == undefined)?null:params.BND_EXCLUYE_ARTICULOS_OFERTA;
        
        params.JSON_ID_PRODUCTOS_INCLUIDOS = (params.JSON_ID_PRODUCTOS_INCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_INCLUIDOS;
        params.JSON_ID_CATEGORIAS_INCLUIDAS= (params.JSON_ID_CATEGORIAS_INCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_INCLUIDAS;
        params.JSON_ROLES_INCLUIDOS     = (params.JSON_ROLES_INCLUIDOS == undefined)?null:params.JSON_ROLES_INCLUIDOS;
        params.JSON_ID_USUARIOS_INCLUIDOS    = (params.JSON_ID_USUARIOS_INCLUIDOS == undefined)? null :params.JSON_ID_USUARIOS_INCLUIDOS;
        params.JSON_ID_TIENDAS_INCLUIDAS = (params.JSON_ID_TIENDAS_INCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_INCLUIDAS;


        params.JSON_ID_PRODUCTOS_EXCLUIDOS      = (params.JSON_ID_PRODUCTOS_EXCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_EXCLUIDOS;
        params.JSON_ROLES_EXCLUIDOS   = (params.JSON_ROLES_EXCLUIDOS == undefined)?null:params.JSON_ROLES_EXCLUIDOS;
        params.JSON_ID_CATEGORIAS_EXCLUIDAS= (params.JSON_ID_CATEGORIAS_EXCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_EXCLUIDAS;
        params.JSON_ID_USUARIOS_EXCLUIDOS    = (params.JSON_ID_USUARIOS_EXCLUIDOS == undefined)? null :params.JSON_ID_USUARIOS_EXCLUIDOS;
        params.JSON_ID_TIENDAS_EXCLUIDAS = (params.JSON_ID_TIENDAS_EXCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_EXCLUIDAS;

        params.NUM_LIMITE_USO_POR_PROMO   = (params.NUM_LIMITE_USO_POR_PROMO == undefined)?null:params.NUM_LIMITE_USO_POR_PROMO;
        params.NUM_LIMITE_USO_POR_USUARIO   = (params.NUM_LIMITE_USO_POR_USUARIO == undefined)?null:params.NUM_LIMITE_USO_POR_USUARIO;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.DES_DESCRIPCION);

        if(validate_nombre && validate_slug){


            //Valido que el DES_DESCRIPCION no esté tomado 
            const nombre = await pool.query(consulta.search(REGLAS.TABLA, REGLAS.DES_NOMBRE, params.DES_NOMBRE, 'equals' ));
            if(nombre.length > 0){
                return res.status(400).send({
                    'message': 'El nombre ya fue tomado '
                });
            }

            //Guardar en la base de datos
            const data = {
                
                DES_NOMBRE: params.DES_NOMBRE ,
                DES_DESCRIPCION: params.DES_DESCRIPCION       ,
                FECHA_INICIO: params.FECHA_INICIO         ,
                FECHA_FIN: params.FECHA_FIN         ,
                NUM_IMPORTE: params.NUM_IMPORTE     ,
                NUM_TIPO_REGLA: params.NUM_TIPO_REGLA         ,
                BDN_ENVIO_GRATUITO: params.BDN_ENVIO_GRATUITO   ,
                NUM_GASTO_MINIMO: params.NUM_GASTO_MINIMO   ,
                NUM_GASTO_MAXIMO: params.NUM_GASTO_MAXIMO    ,
                BND_USO_INDIVIDUAL: params.BND_USO_INDIVIDUAL     ,
                BDN_EXCLUYE_ARTICULOS_OFERTA: params.BND_EXCLUYE_ARTICULOS_OFERTA ,
                JSON_ID_PRODUCTOS_INCLUIDOS: params.JSON_ID_PRODUCTOS_INCLUIDOS ,
                JSON_ID_CATEGORIAS_INCLUIDAS: params.JSON_ID_CATEGORIAS_INCLUIDAS,
                JSON_ROLES_INCLUIDOS: params.JSON_ROLES_INCLUIDOS     ,
                JSON_ID_USUARIOS_INCLUIDOS: params.JSON_ID_USUARIOS_INCLUIDOS   ,
                JSON_ID_TIENDAS_EXCLUIDAS: params.JSON_ID_TIENDAS_EXCLUIDAS ,
                JSON_ID_PRODUCTOS_EXCLUIDOS: params.JSON_ID_PRODUCTOS_EXCLUIDOS      ,
                JSON_ROLES_EXCLUIDOS: params.JSON_ROLES_EXCLUIDOS   ,
                JSON_ID_CATEGORIAS_EXCLUIDAS: params.JSON_ID_CATEGORIAS_EXCLUIDAS,
                JSON_ID_USUARIOS_EXCLUIDOS: params.JSON_ID_USUARIOS_EXCLUIDOS    ,
                JSON_ID_TIENDAS_INCLUIDAS: params.JSON_ID_TIENDAS_INCLUIDAS ,
                NUM_LIMITE_USO_POR_PROMO: params.NUM_LIMITE_USO_POR_PROMO,
                NUM_LIMITE_USO_POR_USUARIO: params.NUM_LIMITE_USO_POR_USUARIO,
                 
                FECHA: date,
                ESTATUS: 1
            }

            try{
                consulta.funciones.insertTable(REGLAS.TABLA, data);

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
        const lista = await pool.query(consulta.list(REGLAS.TABLA));
        return res.status(400).send({
            'lista': lista
        });
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
        //Validar datos
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_DESCRIPCION         = (params.DES_DESCRIPCION == undefined)?'':params.DES_DESCRIPCION;
        params.FECHA_INICIO         = (params.FECHA_INICIO == undefined)?'':params.FECHA_INICIO;
        params.FECHA_FIN         = (params.FECHA_FIN == undefined)?'':params.FECHA_FIN;

        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.NUM_TIPO_REGLA          = (params.NUM_TIPO_REGLA == undefined)?'':params.NUM_TIPO_REGLA;
        params.BDN_ENVIO_GRATUITO   = (params.BDN_ENVIO_GRATUITO == undefined)?null:params.BDN_ENVIO_GRATUITO;
        params.NUM_GASTO_MINIMO   = (params.NUM_GASTO_MINIMO == undefined)?null:params.NUM_GASTO_MINIMO;
        params.NUM_GASTO_MAXIMO    = (params.NUM_GASTO_MAXIMO == undefined)?null:params.NUM_GASTO_MAXIMO;
        params.BND_USO_INDIVIDUAL       = (params.BND_USO_INDIVIDUAL == undefined)?null:params.BND_USO_INDIVIDUAL;
        params.BND_EXCLUYE_ARTICULOS_OFERTA         = (params.BND_EXCLUYE_ARTICULOS_OFERTA == undefined)?null:params.BND_EXCLUYE_ARTICULOS_OFERTA;
        
        params.JSON_ID_PRODUCTOS_INCLUIDOS = (params.JSON_ID_PRODUCTOS_INCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_INCLUIDOS;
        params.JSON_ID_CATEGORIAS_INCLUIDAS= (params.JSON_ID_CATEGORIAS_INCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_INCLUIDAS;
        params.JSON_ROLES_INCLUIDOS     = (params.JSON_ROLES_INCLUIDOS == undefined)?null:params.JSON_ROLES_INCLUIDOS;
        params.JSON_ID_USUARIOS_INCLUIDOS    = (params.JSON_ID_USUARIOS_INCLUIDOS == undefined)? null :params.JSON_ID_USUARIOS_INCLUIDOS;
        params.JSON_ID_TIENDAS_INCLUIDAS = (params.JSON_ID_TIENDAS_INCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_INCLUIDAS;


        params.JSON_ID_PRODUCTOS_EXCLUIDOS      = (params.JSON_ID_PRODUCTOS_EXCLUIDOS == undefined)?null:params.JSON_ID_PRODUCTOS_EXCLUIDOS;
        params.JSON_ROLES_EXCLUIDOS   = (params.JSON_ROLES_EXCLUIDOS == undefined)?null:params.JSON_ROLES_EXCLUIDOS;
        params.JSON_ID_CATEGORIAS_EXCLUIDAS= (params.JSON_ID_CATEGORIAS_EXCLUIDAS == undefined)?null:params.JSON_ID_CATEGORIAS_EXCLUIDAS;
        params.JSON_ID_USUARIOS_EXCLUIDOS    = (params.JSON_ID_USUARIOS_EXCLUIDOS == undefined)? null :params.JSON_ID_USUARIOS_EXCLUIDOS;
        params.JSON_ID_TIENDAS_EXCLUIDAS = (params.JSON_ID_TIENDAS_EXCLUIDAS == undefined)?null:params.JSON_ID_TIENDAS_EXCLUIDAS;

        params.NUM_LIMITE_USO_POR_PROMO   = (params.NUM_LIMITE_USO_POR_PROMO == undefined)?null:params.NUM_LIMITE_USO_POR_PROMO;
        params.NUM_LIMITE_USO_POR_USUARIO   = (params.NUM_LIMITE_USO_POR_USUARIO == undefined)?null:params.NUM_LIMITE_USO_POR_USUARIO;

        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.DES_DESCRIPCION);
        let validate_estatus  = !validator.isEmpty(params.ESTATUS);

        
        if(validate_nombre || validate_slug || validate_estatus || params.NUM_IMPORTE || params.NUM_TIPO_REGLA || params.BDN_ENVIO_GRATUITO || params.NUM_GASTO_MINIMO || params.NUM_GASTO_MAXIMO
            || params.BND_USO_INDIVIDUAL || params.BND_EXCLUYE_ARTICULOS_OFERTA || params.JSON_ID_CATEGORIAS_INCLUIDAS || params.JSON_ID_PRODUCTOS_EXCLUIDOS
            || params.JSON_ID_PRODUCTOS_INCLUIDOS || params.JSON_ROLES_EXCLUIDOS || params.JSON_ROLES_INCLUIDOS || params.JSON_ID_USUARIOS_INCLUIDOS
            ||params.NUM_LIMITE_USO_POR_PROMO || params.JSON_ID_USUARIOS_EXCLUIDOS || params.NUM_LIMITE_USO_POR_USUARIO || params.NUM_GASTO_MAXIMO || params.JSON_GASTO_MINIMO){

            //Valido si el cupon existe
            const cupon = await pool.query(consulta.get(REGLAS.TABLA, id));
            if(cupon.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el DES_DESCRIPCION no esté tomado 
            const nombre = await pool.query(consulta.search(REGLAS.TABLA, REGLAS.DES_DESCRIPCION, params.DES_NOMBRE, 'equals' ));
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
                DES_NOMBRE:(params.DES_NOMBRE == null)?produc.DES_NOMBRE:params.DES_NOMBRE,
                DES_DESCRIPCION: (params.DES_DESCRIPCION == null)?produc.DES_DESCRIPCION:params.DES_DESCRIPCION,
                FECHA_INICIO: (params.FECHA_INICIO == null)?produc.FECHA_INICIO:params.FECHA_INICIO,
                FECHA_FIN: (params.FECHA_FIN == null)?produc.FECHA_FIN:params.FECHA_FIN,
                NUM_IMPORTE: (params.NUM_IMPORTE == null)?produc.NUM_IMPORTE:params.NUM_IMPORTE,
                NUM_TIPO_REGLA: (params.NUM_TIPO_REGLA == null)?produc.NUM_TIPO_REGLA:params.NUM_TIPO_REGLA,
                BDN_ENVIO_GRATUITO: (params.JSON_ID_TIENDAS_INCLUIDAS == null)?produc.JSON_ID_TIENDAS_INCLUIDAS:params.JSON_ID_TIENDAS_INCLUIDAS,
                NUM_GASTO_MINIMO: (params.NUM_GASTO_MINIMO == null)?produc.NUM_GASTO_MINIMO:params.NUM_GASTO_MINIMO,
                NUM_GASTO_MAXIMO: (params.JSON_ID_TIENDAS_INCLUIDAS == null)?produc.JSON_ID_TIENDAS_INCLUIDAS:params.JSON_ID_TIENDAS_INCLUIDAS,
                BND_USO_INDIVIDUAL: (params.BND_USO_INDIVIDUAL == null)?produc.BND_USO_INDIVIDUAL:params.BND_USO_INDIVIDUAL,
                BDN_EXCLUYE_ARTICULOS_OFERTA: (params.BDN_EXCLUYE_ARTICULOS_OFERTA == null)?produc.BDN_EXCLUYE_ARTICULOS_OFERTA:params.BDN_EXCLUYE_ARTICULOS_OFERTA,
                JSON_ID_PRODUCTOS_INCLUIDOS: (params.JSON_ID_PRODUCTOS_INCLUIDOS == null)?produc.JSON_ID_PRODUCTOS_INCLUIDOS:params.JSON_ID_PRODUCTOS_INCLUIDOS,
                JSON_ID_CATEGORIAS_INCLUIDAS: (params.JSON_ID_CATEGORIAS_INCLUIDAS == null)?produc.JSON_ID_CATEGORIAS_INCLUIDAS:params.JSON_ID_CATEGORIAS_INCLUIDAS,
                JSON_ROLES_INCLUIDOS: (params.JSON_ROLES_INCLUIDOS == null)?produc.JSON_ROLES_INCLUIDOS:params.JSON_ROLES_INCLUIDOS,
                JSON_ID_USUARIOS_INCLUIDOS: (params.JSON_ID_USUARIOS_INCLUIDOS == null)?produc.JSON_ID_USUARIOS_INCLUIDOS:params.JSON_ID_USUARIOS_INCLUIDOS,
                JSON_ID_TIENDAS_EXCLUIDAS: (params.JSON_ID_TIENDAS_EXCLUIDAS == null)?produc.JSON_ID_TIENDAS_EXCLUIDAS:params.JSON_ID_TIENDAS_EXCLUIDAS,
                JSON_ID_PRODUCTOS_EXCLUIDOS: (params.JSON_ID_PRODUCTOS_EXCLUIDOS == null)?produc.JSON_ID_PRODUCTOS_EXCLUIDOS:params.JSON_ID_PRODUCTOS_EXCLUIDOS,
                JSON_ROLES_EXCLUIDOS: (params.JSON_ROLES_EXCLUIDOS == null)?produc.JSON_ROLES_EXCLUIDOS:params.JSON_ROLES_EXCLUIDOS,
                JSON_ID_CATEGORIAS_EXCLUIDAS:(params.JSON_ID_CATEGORIAS_EXCLUIDAS == null)?produc.JSON_ID_CATEGORIAS_EXCLUIDAS:params.JSON_ID_CATEGORIAS_EXCLUIDAS,
                JSON_ID_USUARIOS_EXCLUIDOS: (params.JSON_ID_USUARIOS_EXCLUIDOS == null)?produc.JSON_ID_USUARIOS_EXCLUIDOS:params.JSON_ID_USUARIOS_EXCLUIDOS,
                JSON_ID_TIENDAS_INCLUIDAS: (params.JSON_ID_TIENDAS_INCLUIDAS == null)?produc.JSON_ID_TIENDAS_INCLUIDAS:params.JSON_ID_TIENDAS_INCLUIDAS,
                NUM_LIMITE_USO_POR_PROMO: (params.NUM_LIMITE_USO_POR_PROMO == null)?produc.NUM_LIMITE_USO_POR_PROMO:params.NUM_LIMITE_USO_POR_PROMO,
                NUM_LIMITE_USO_POR_USUARIO: (params.NUM_LIMITE_USO_POR_USUARIO == null)?produc.NUM_LIMITE_USO_POR_USUARIO:params.NUM_LIMITE_USO_POR_USUARIO,
                FECHA: produc.FECHA,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
            }

            try{
                consulta.funciones.update(REGLAS.TABLA, data);

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
        const borrar = await pool.query(consulta.remove(REGLAS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Cupón eliminado exitosamente',
         
        });
    }
}

module.exports = reglas