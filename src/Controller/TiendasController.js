//Librerías y servicios
const validator = require('validator');
const TIENDAS = require('../Models/Tiendas');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const tiendas = {
    crear: async function(req, res){
        let params = req.body;

        //Validar datos
        params.DES_NOMBRE_TIENDA   = (params.DES_NOMBRE_TIENDA == undefined)?'':params.DES_NOMBRE_TIENDA;
        params.DES_SLUG_TIENDA   = (params.DES_SLUG_TIENDA == undefined)?'':params.DES_SLUG_TIENDA;
        params.NUM_COMISION   = (params.NUM_COMISION == undefined)?'':params.NUM_COMISION;
        params.DES_URL_BANNER_LT   = (params.DES_URL_BANNER_LT == undefined)?'':params.DES_URL_BANNER_LT;
        params.DES_CORREO_TIENDA   = (params.DES_CORREO_TIENDA == undefined)?'':params.DES_CORREO_TIENDA;
        params.DES_URL_LOGO   = (params.DES_URL_LOGO == undefined)?'':params.DES_URL_LOGO;
        params.DES_URL_BANNER   = (params.DES_URL_BANNER == undefined)?'':params.DES_URL_BANNER;

        let validate_DES_NOMBRE_TIENDA   = !validator.isEmpty(params.DES_NOMBRE_TIENDA);
        let validate_DES_SLUG_TIENDA  = !validator.isEmpty(params.DES_SLUG_TIENDA);
        let validate_NUM_COMISION  = !validator.isEmpty(params.NUM_COMISION);
        let validate_DES_URL_BANNER_LT   = !validator.isEmpty(params.DES_URL_BANNER_LT);
        let validate_DES_CORREO_TIENDA  = !validator.isEmpty(params.DES_CORREO_TIENDA);
        let validate_DES_URL_LOGO  = !validator.isEmpty(params.DES_URL_LOGO);
        let validate_DES_URL_BANNER   = !validator.isEmpty(params.DES_URL_BANNER);

        if(validate_DES_NOMBRE_TIENDA && validate_DES_SLUG_TIENDA && validate_NUM_COMISION && validate_DES_CORREO_TIENDA){

            //Valido que el DES_NOMBRE_TIENDA, el correo o el DES_SLUG_TIENDA no esten tomados
            const valida = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.NOMBRE, params.DES_NOMBRE_TIENDA, 'equals'));
            if(valida.length > 0){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const valida_correo = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.CORREO, params.DES_CORREO_TIENDA, 'equals'));
            if(valida_correo.length > 0){
                return res.status(400).send({
                    'message': 'Correo de la tienda ya fue tomado'
                });
            }

            const valida_DES_SLUG_TIENDA = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.SLUG, params.DES_SLUG_TIENDA, 'equals'));
            if(valida_DES_SLUG_TIENDA.length > 0){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const data = {
                ID_USUARIO: req.user.sub,
                DES_SLUG_TIENDA:params.DES_SLUG_TIENDA,
                DES_NOMBRE_TIENDA:params.DES_NOMBRE_TIENDA,
                NUM_COMISION:params.NUM_COMISION,
                DES_CORREO_TIENDA:params.DES_CORREO_TIENDA,
                DES_URL_LOGO: params.DES_URL_LOGO,
                DES_URL_BANNER:params.DES_URL_BANNER,
                DES_URL_BANNER_LT:params.DES_URL_BANNER_LT,
                FECHA:date, 
                ESTATUS: 1
            }

            consulta.funciones.insertTable(TIENDAS.TABLA, data);
            return res.status(200).send({
                'message': 'Tienda registrada exitosamente',
                'tienda': data
            });
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }

    },

    mostrar:async function(req, res){
        const lista = await pool.query(consulta.list(TIENDAS.TABLA));

        return res.status(400).send({
            'lista': lista
        });
    },
    
    update:async function(req, res) {
        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.DES_NOMBRE_TIENDA   = (params.DES_NOMBRE_TIENDA == undefined)?'':params.DES_NOMBRE_TIENDA;
        params.DES_SLUG_TIENDA   = (params.DES_SLUG_TIENDA == undefined)?'':params.DES_SLUG_TIENDA;
        params.NUM_COMISION   = (params.NUM_COMISION == undefined)?'':params.NUM_COMISION;
        params.DES_URL_BANNER_LT   = (params.DES_URL_BANNER_LT == undefined)?'':params.DES_URL_BANNER_LT;
        params.DES_CORREO_TIENDA   = (params.DES_CORREO_TIENDA == undefined)?'':params.DES_CORREO_TIENDA;
        params.DES_URL_LOGO   = (params.DES_URL_LOGO == undefined)?'':params.DES_URL_LOGO;
        params.DES_URL_BANNER   = (params.DES_URL_BANNER == undefined)?'':params.DES_URL_BANNER;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_NOMBRE_TIENDA   = !validator.isEmpty(params.DES_NOMBRE_TIENDA);
        let validate_DES_SLUG_TIENDA  = !validator.isEmpty(params.DES_SLUG_TIENDA);
        let validate_NUM_COMISION  = !validator.isEmpty(params.NUM_COMISION);
        let validate_DES_URL_BANNER_LT   = !validator.isEmpty(params.DES_URL_BANNER_LT);
        let validate_DES_CORREO_TIENDA  = !validator.isEmpty(params.DES_CORREO_TIENDA);
        let validate_DES_URL_LOGO  = !validator.isEmpty(params.DES_URL_LOGO);
        let validate_DES_URL_BANNER   = !validator.isEmpty(params.DES_URL_BANNER);
        let validate_ESTATUS   = !validator.isEmpty(params.ESTATUS);

        if(validate_DES_NOMBRE_TIENDA && validate_DES_SLUG_TIENDA && validate_NUM_COMISION && validate_DES_CORREO_TIENDA && validate_ESTATUS){

            //Valido que exista la tienda que actualizaré
            
            let tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el DES_NOMBRE_TIENDA, el correo o el DES_SLUG_TIENDA no esten tomados
            const valida = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.NOMBRE, params.DES_NOMBRE_TIENDA, 'equals'));
            if(valida.length > 0 && tienda[0].DES_NOMBRE_TIENDA != params.DES_NOMBRE_TIENDA){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const valida_correo = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.CORREO, params.DES_CORREO_TIENDA, 'equals'));
            if(valida_correo.length > 0 && tienda[0].DES_CORREO_TIENDA != params.DES_CORREO_TIENDA){
                return res.status(400).send({
                    'message': 'Correo de la tienda ya fue tomado'
                });
            }

            const valida_DES_SLUG_TIENDA = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.SLUG, params.DES_SLUG_TIENDA, 'equals'));
            if(valida_DES_SLUG_TIENDA.length > 0 && tienda[0].DES_SLUG_TIENDA != params.DES_SLUG_TIENDA){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            tienda = tienda[0];
            const data = {
                ID:id,
                ID_USUARIO: req.user.sub,
                DES_SLUG_TIENDA:(params.DES_SLUG_TIENDA == '')?tienda.DES_SLUG_TIENDA:params.DES_SLUG_TIENDA,
                DES_NOMBRE_TIENDA:(params.DES_NOMBRE_TIENDA == '')?tienda.DES_NOMBRE_TIENDA:params.DES_NOMBRE_TIENDA,
                NUM_COMISION:(params.NUM_COMISION == '')?tienda.NUM_COMISION:params.NUM_COMISION,
                DES_CORREO_TIENDA:(params.DES_CORREO_TIENDA == '')?tienda.DES_CORREO_TIENDA:params.DES_CORREO_TIENDA,
                DES_URL_LOGO: (params.DES_URL_LOGO == '')?tienda.DES_URL_LOGO:params.DES_URL_LOGO,
                DES_URL_BANNER:(params.DES_URL_BANNER == '')?tienda.DES_URL_BANNER:params.DES_URL_BANNER,
                DES_URL_BANNER_LT:(params.DES_URL_BANNER_LT == '')?tienda.DES_URL_BANNER_LT:params.DES_URL_BANNER_LT,
                FECHA:tienda.FECHA, 
                ESTATUS: (params.ESTATUS == '')?tienda.ESTATUS:params.ESTATUS,
            }

            consulta.funciones.update(TIENDAS.TABLA, data);
            return res.status(200).send({
                'message': 'Tienda registrada exitosamente',
                'tienda': data
            });
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(TIENDAS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Tienda eliminada exitosamente',
         
        });
    }
}

module.exports = tiendas;