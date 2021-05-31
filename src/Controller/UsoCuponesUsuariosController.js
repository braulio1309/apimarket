//Librerías y servicios
const validator = require('validator');
const USO = require('../Models/Uso_cupones_usuarios');
const USUARIOS = require('../Models/User');
const CUPONES = require('../Models/Cupones');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const uso_cupones = {
    
    crear: async function(req, res){
        let params = req.body;

        //Validar datos
        params.ID_CUPON       = (params.ID_CUPON == undefined)?'':params.ID_CUPON;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
        params.DES_CUPON     = (params.DES_CUPON == undefined)?'':params.DES_CUPON;
        params.DES_IP_CLIENTE          = (params.DES_IP_CLIENTE == undefined)?'':params.DES_IP_CLIENTE;

        if(params.ID_CUPON  &&  params.ID_USUARIO && params.DES_CUPON){

            //Valido si el cupon existe
            const cupon = await pool.query(consulta.get(CUPONES.TABLA, params.ID_CUPON));
            if(cupon.length == 0){
                return res.status(400).send({
                    'message': 'cupon no existe'
                });
            }

            //Valido que el slug no esté tomado 
            const usuario = await pool.query(consulta.get(USUARIO.TABLA, PRODUCTOS.ID_USUARIO));
            if(usuario.length == 0){
                return res.status(400).send({
                    'message': 'El usuario no existe'
                });
            }

            //Guardar en la base de datos
            const data = {
               
                ID_USUARIO:params.ID_USUARIO,
                DES_IP_CLIENTE:params.DES_IP_CLIENTE,
                ID_CUPON_PRODUCTO:params.ID_CUPON_PRODUCTO,
                
                DES_CUPON: params.DES_CUPON,
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

            



        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
    },

    mostrar:async function(req, res){
         //let user =  await pool.query(consulta.list('DES_USUARIOs'))
         let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM uso_cupones_usuarios', null)
        

         return user
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const id = req.params.id

        //Validar datos
        params.ID_CUPON       = (params.ID_CUPON == undefined)?'':params.ID_CUPON;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
        params.DES_CUPON     = (params.DES_CUPON == undefined)?'':params.DES_CUPON;
        params.DES_IP_CLIENTE          = (params.DES_IP_CLIENTE == undefined)?'':params.DES_IP_CLIENTE;
        params.STATUS = (params.STATUS == undefined)?'':params.STATUS;

       

        if( params.ID_CUPON  ||  params.ID_USUARIO || params.DES_CUPON || params.STATUS || params.DES_IP_CLIENTE){

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
                ID_CUPON:(params.ID_CUPON == '')?produc.ID_CUPON:params.ID_CUPON,
                DES_CUPON: (params.DES_CUPON == '')?produc.DES_CUPON:params.DES_CUPON,
                DES_IP_CLIENTE: (params.DES_IP_CLIENTE == '')?produc.DES_IP_CLIENTE:params.DES_IP_CLIENTE,
                FECHA: produc.FECHA,
                ESTATUS:  (params.STATUS == '')?produc.STATUS:params.STATUS
            }

            try{
                consulta.funciones.update(USO.TABLA, data);

            }catch(e){
                return res.status(200).send({
                    'message': 'Pedido actualizado con exito',
                    'pedido': data
                }); 
            }

            



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