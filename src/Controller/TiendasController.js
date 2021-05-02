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
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.slug   = (params.slug == undefined)?'':params.slug;
        params.comision   = (params.comision == undefined)?'':params.comision;
        params.banner_lt   = (params.banner_lt == undefined)?'':params.banner_lt;
        params.email   = (params.email == undefined)?'':params.email;
        params.logo   = (params.logo == undefined)?'':params.logo;
        params.banner   = (params.banner == undefined)?'':params.banner;

        let validate_nombre   = !validator.isEmpty(params.nombre);
        let validate_slug  = !validator.isEmpty(params.slug);
        let validate_comision  = !validator.isEmpty(params.comision);
        let validate_banner_lt   = !validator.isEmpty(params.banner_lt);
        let validate_email  = !validator.isEmpty(params.email);
        let validate_logo  = !validator.isEmpty(params.logo);
        let validate_banner   = !validator.isEmpty(params.banner);

        if(validate_nombre && validate_slug && validate_comision && validate_email){

            //Valido que el nombre, el correo o el slug no esten tomados
            const valida = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.NOMBRE, params.nombre, 'equals'));
            if(valida.length > 0){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const valida_correo = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.CORREO, params.email, 'equals'));
            if(valida_correo.length > 0){
                return res.status(400).send({
                    'message': 'Correo de la tienda ya fue tomado'
                });
            }

            const valida_slug = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.SLUG, params.slug, 'equals'));
            if(valida_slug.length > 0){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const data = {
                ID_USUARIO: req.user.sub,
                DES_SLUG_TIENDA:params.slug,
                DES_NOMBRE_TIENDA:params.nombre,
                NUM_COMISION:params.comision,
                DES_CORREO_TIENDA:params.email,
                DES_URL_LOGO: params.logo,
                DES_URL_BANNER:params.banner,
                DES_URL_BANNER_LT:params.banner_lt,
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
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.slug   = (params.slug == undefined)?'':params.slug;
        params.comision   = (params.comision == undefined)?'':params.comision;
        params.banner_lt   = (params.banner_lt == undefined)?'':params.banner_lt;
        params.email   = (params.email == undefined)?'':params.email;
        params.logo   = (params.logo == undefined)?'':params.logo;
        params.banner   = (params.banner == undefined)?'':params.banner;
        params.estatus   = (params.estatus == undefined)?'':params.estatus;

        let validate_nombre   = !validator.isEmpty(params.nombre);
        let validate_slug  = !validator.isEmpty(params.slug);
        let validate_comision  = !validator.isEmpty(params.comision);
        let validate_banner_lt   = !validator.isEmpty(params.banner_lt);
        let validate_email  = !validator.isEmpty(params.email);
        let validate_logo  = !validator.isEmpty(params.logo);
        let validate_banner   = !validator.isEmpty(params.banner);
        let validate_estatus   = !validator.isEmpty(params.estatus);

        if(validate_nombre && validate_slug && validate_comision && validate_email && validate_estatus){

            //Valido que exista la tienda que actualizaré
            
            let tienda = await pool.query(consulta.get(TIENDAS.TABLA, id));
            if(tienda.length == 0){
                return res.status(400).send({
                    'message': 'Tienda no existe'
                });
            }

            //Valido que el nombre, el correo o el slug no esten tomados
            const valida = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.NOMBRE, params.nombre, 'equals'));
            if(valida.length > 0 && tienda[0].DES_NOMBRE_TIENDA != params.nombre){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            const valida_correo = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.CORREO, params.email, 'equals'));
            if(valida_correo.length > 0 && tienda[0].DES_CORREO_TIENDA != params.email){
                return res.status(400).send({
                    'message': 'Correo de la tienda ya fue tomado'
                });
            }

            const valida_slug = await pool.query(consulta.search(TIENDAS.TABLA, TIENDAS.SLUG, params.slug, 'equals'));
            if(valida_slug.length > 0 && tienda[0].DES_SLUG_TIENDA != params.slug){
                return res.status(400).send({
                    'message': 'Nombre de la tienda ya fue tomado'
                });
            }

            tienda = tienda[0];
            const data = {
                ID:id,
                ID_USUARIO: req.user.sub,
                DES_SLUG_TIENDA:(params.slug == '')?tienda.DES_SLUG_TIENDA:params.slug,
                DES_NOMBRE_TIENDA:(params.nombre == '')?tienda.DES_NOMBRE_TIENDA:params.nombre,
                NUM_COMISION:(params.comision == '')?tienda.NUM_COMISION:params.comision,
                DES_CORREO_TIENDA:(params.email == '')?tienda.DES_CORREO_TIENDA:params.email,
                DES_URL_LOGO: (params.logo == '')?tienda.DES_URL_LOGO:params.logo,
                DES_URL_BANNER:(params.banner == '')?tienda.DES_URL_BANNER:params.banner,
                DES_URL_BANNER_LT:(params.banner_lt == '')?tienda.DES_URL_BANNER_LT:params.banner_lt,
                FECHA:tienda.FECHA, 
                ESTATUS: (params.estatus == '')?tienda.ESTATUS:params.estatus,
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