//Librerías y servicios
const validator = require('validator');
const USO = require('../Models/Uso_reglas_descuentos_usuarios');
const USUARIOS = require('../Models/User');
const REGLAS = require('../Models/Reglas_descuento');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const uso_cupones = {
    
    crear: async function(req, res){
        let params = req.body;

        //Validar datos
        params.ID_REGLA_DESCUENTO       = (params.ID_REGLA_DESCUENTO == undefined)?'':params.ID_REGLA_DESCUENTO;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?'':parseInt(params.ID_USUARIO);
        params.DES_IP_CLIENTE          = (params.DES_IP_CLIENTE == undefined)?'':params.DES_IP_CLIENTE;

        if(params.ID_REGLA_DESCUENTO  &&  params.ID_USUARIO && params.DES_IP_CLIENTE){

            //Valido si la regla existe
            const cupon = await pool.query(consulta.get(REGLAS.TABLA, params.ID_REGLA_DESCUENTO));
            if(cupon.length == 0){
                return res.status(400).send({
                    'message': 'cupon no existe'
                });
            }

            //Valido que el slug no esté tomado 
            
            const usuario = await pool.query(consulta.get(USUARIOS.TABLA, params.ID_USUARIO));
            if(usuario.length == 0){
                return res.status(400).send({
                    'message': 'El usuario no existe'
                });
            }

            //Guardar en la base de datos
            const data = {
               
                ID_USUARIO:params.ID_USUARIO,
                DES_IP_CLIENTE:params.DES_IP_CLIENTE,
                ID_REGLA_DESCUENTO:params.ID_REGLA_DESCUENTO,
                DES_IP_CLIENTE: params.DES_IP_CLIENTE,
                FECHA: date,
                STATUS: 1
            }

            try{
                consulta.funciones.insertTable(USO.TABLA, data);

            }catch(e){
                return res.status(200).send({
                    'message': 'El usuario registrado con exito',
                    'producto': data
                }); 
            }
            return res.status(200).send({
                'message': 'El usuario registrado con exito',
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
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM uso_reglas_descuentos_usuarios', null)
        

        return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('uso_reglas_descuentos_usuarios', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id

        //Validar datos
        params.ID_REGLA_DESCUENTO       = (params.ID_REGLA_DESCUENTO == undefined)?'':params.ID_REGLA_DESCUENTO;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
        params.DES_IP_CLIENTE          = (params.DES_IP_CLIENTE == undefined)?'':params.DES_IP_CLIENTE;
        params.STATUS = (params.STATUS == undefined)?'':params.STATUS;

       

        if( params.ID_REGLA_DESCUENTO  ||  params.ID_USUARIO  || params.STATUS || params.DES_IP_CLIENTE){

            //Valido que exista el producto
            let produc = await pool.query(consulta.get(USO.TABLA, id))
            if(produc.length == 0){
                return res.status(400).send({
                    'message': 'El pedido no existe '
                });
            }
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                ID_USUARIO:(params.ID_USUARIO == '')?produc.ID_USUARIO:params.ID_USUARIO,
                DES_IP_CLIENTE:(params.DES_IP_CLIENTE == '')?produc.DES_IP_CLIENTE_PRODUCTO:params.DES_IP_CLIENTE,
                ID_REGLA_DESCUENTO:(params.ID_REGLA_DESCUENTO == '')?produc.ID_REGLA_DESCUENTO:params.ID_REGLA_DESCUENTO,
                DES_IP_CLIENTE: (params.DES_IP_CLIENTE == '')?produc.DES_IP_CLIENTE:params.DES_IP_CLIENTE,
                FECHA: produc.FECHA,
                STATUS:  (params.STATUS == '')?produc.STATUS:params.STATUS
            }

            try{
                consulta.funciones.update(USO.TABLA, data);

            }catch(e){
                return res.status(200).send({
                    'message': 'Pedido actualizado con exito',
                    'pedido': data
                }); 
            }

            return res.status(200).send({
                'message': 'Pedido actualizado con exito',
                'pedido': data
            }); 



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(USO.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Pedido eliminado exitosamente',
         
        });
    }
}

module.exports = uso_cupones