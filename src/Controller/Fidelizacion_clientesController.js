//Librerías y servicios
const validator = require('validator');
const FIDELIZACION = require('../Models/Fidelizacion_clientes');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql');
const date = new Date();

const fidelizacion = {
    
    crear: async function(req, res){
        let params = req.body;

      
        //Validar datos
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.NUM_TIPO_FIDELIZACION         = (params.NUM_TIPO_FIDELIZACION == undefined)?'':params.NUM_TIPO_FIDELIZACION;
        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.NUM_MAX_REGISTROS          = (params.NUM_MAX_REGISTROS == undefined)?'':params.NUM_MAX_REGISTROS;
        params.FECHA_INICIO   = (params.FECHA_INICIO == undefined)?null:params.FECHA_INICIO;
        params.FECHA_FIN   = (params.FECHA_FIN == undefined)?null:params.FECHA_FIN;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.NUM_TIPO_FIDELIZACION);

        if(validate_nombre && validate_slug){


            //Valido que el nombre no esté tomado 
            const nombre = await pool.query(consulta.search(FIDELIZACION.TABLA, FIDELIZACION.DES_NOMBRE, params.DES_NOMBRE, 'equals' ));
            if(nombre.length > 0){
                return res.status(400).send({
                    'message': 'El nombre ya fue tomado '
                });
            }

            //Guardar en la base de datos
            const data = {
                NUM_TIPO_FIDELIZACION:params.NUM_TIPO_FIDELIZACION,
                NUM_MAX_REGISTROS:params.NUM_MAX_REGISTROS,
                DES_NOMBRE:params.DES_NOMBRE,
                FECHA_INICIO:params.FECHA_INICIO, 
                FECHA_FIN: params.FECHA_FIN,
                NUM_IMPORTE: params.NUM_IMPORTE,
                ID_USUARIO_ALTA: params.ID_USUARIO_ALTA,
                FECHA: date,
                ESTATUS: 1
            }

            try{
                consulta.funciones.insertTable(FIDELIZACION.TABLA, data);

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
        const lista = await pool.query(consulta.list(FIDELIZACION.TABLA));
        return res.status(400).send({
            'lista': lista
        });
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.DES_NOMBRE       = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.NUM_TIPO_FIDELIZACION         = (params.NUM_TIPO_FIDELIZACION == undefined)?'':params.NUM_TIPO_FIDELIZACION;
        params.NUM_IMPORTE     = (params.NUM_IMPORTE == undefined)?0:params.NUM_IMPORTE;
        params.NUM_MAX_REGISTROS          = (params.NUM_MAX_REGISTROS == undefined)?'':params.NUM_MAX_REGISTROS;
        params.FECHA_INICIO   = (params.FECHA_INICIO == undefined)?null:params.FECHA_INICIO;
        params.FECHA_FIN   = (params.FECHA_FIN == undefined)?null:params.FECHA_FIN;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_nombre   = !validator.isEmpty(params.DES_NOMBRE);
        let validate_slug  = !validator.isEmpty(params.NUM_TIPO_FIDELIZACION);
        let validate_estatus  = !validator.isEmpty(params.ESTATUS);

        
        if(validate_nombre || validate_slug || validate_estatus || params.NUM_IMPORTE || params.NUM_MAX_REGISTROS || params.FECHA_INICIO || params.FECHA_FIN){

            //Valido si el fide existe
            const fide = await pool.query(consulta.get(FIDELIZACION.TABLA, id));
            if(fide.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el NUM_TIPO_FIDELIZACION no esté tomado 
            const nombre = await pool.query(consulta.search(FIDELIZACION.TABLA, FIDELIZACION.NUM_TIPO_FIDELIZACION, params.DES_NOMBRE, 'equals' ));
            if(nombre.length > 1){
                return res.status(400).send({
                    'message': 'El nombre ya fue tomado '
                });
            }

           
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                NUM_TIPO_FIDELIZACION:(params.NUM_TIPO_FIDELIZACION == '')?produc.NUM_TIPO_FIDELIZACION:params.NUM_TIPO_FIDELIZACION,
                NUM_MAX_REGISTROS:(params.NUM_MAX_REGISTROS == '')?produc.DES_SKU_PRODUCTO:params.NUM_MAX_REGISTROS,
                DES_NOMBRE:(params.DES_NOMBRE == '')?produc.DES_NOMBRE:params.DES_NOMBRE,
                FECHA_INICIO:(params.FECHA_INICIO == null)?produc.FECHA_INICIO:params.FECHA_INICIO, 
                FECHA_FIN: (params.FECHA_FIN == null)?produc.FECHA_FIN:params.FECHA_FIN,
                NUM_IMPORTE: (params.NUM_IMPORTE == null)?produc.NUM_IMPORTE:parseFloat(params.NUM_IMPORTE),
                FECHA: produc.FECHA,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
            }

            try{
                consulta.funciones.update(FIDELIZACION.TABLA, data);

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
        const borrar = await pool.query(consulta.remove(FIDELIZACION.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Cupón eliminado exitosamente',
         
        });
    }
}

module.exports = fidelizacion