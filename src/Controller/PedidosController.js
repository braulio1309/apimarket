//Librerías y servicios
const validator = require('validator');
const USUARIOS = require('../Models/User');
const PEDIDOS = require('../Models/Pedidos');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const pedidos = {
    
    crear: async function(req, res){
        let params = req.body;

        const id = req.params.id;
        
        //Validar datos
        params.NUM_TOTAL              = (params.NUM_TOTAL == undefined)? null:params.NUM_TOTAL;
        params.JSON_DIRECCION_FACTURA = (params.JSON_DIRECCION_FACTURA == undefined)?null:params.JSON_DIRECCION_FACTURA;
        params.JSON_DIRECCION_ENVIO   = (params.JSON_DIRECCION_ENVIO == undefined)?null:params.JSON_DIRECCION_ENVIO;
        params.JSON_NOTAS_PEDIDO      = (params.JSON_NOTAS_PEDIDO == undefined)?null:params.JSON_NOTAS_PEDIDO;
        
        const data = {
            ID_USUARIO: id,
            NUM_TOTAL: params.NUM_TOTAL,
            JSON_DIRECCION_FACTURA: JSON.stringify(params.JSON_DIRECCION_FACTURA),
            JSON_DIRECCION_ENVIO:JSON.stringify(params.JSON_DIRECCION_ENVIO),
            JSON_NOTAS_PEDIDO: JSON.stringify(params.JSON_NOTAS_PEDIDO),
            FECHA: date,
            ESTATUS: 1
        }

        try{
            consulta.funciones.insertTable(PEDIDOS.TABLA, data, res);

        }catch(e){
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }
       return res.status(200).send({
            'message': 'Pedido registrado con exito',
            'pedidos': data
       }); 
    },

    mostrar:async function(req, res){
         //let user =  await pool.query(consulta.list('DES_USUARIOs'))
         let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM pedidos', null)
        

         return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('pedidos', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body
        const id = req.params.id;

        
        
        //Validar datos
        params.ID_USUARIO              = (params.ID_USUARIO == undefined)? null:params.ID_USUARIO;
        params.NUM_TOTAL              = (params.NUM_TOTAL == undefined)? null:params.NUM_TOTAL;
        params.JSON_DIRECCION_FACTURA = (params.JSON_DIRECCION_FACTURA == undefined)?null:params.JSON_DIRECCION_FACTURA;
        params.JSON_DIRECCION_ENVIO   = (params.JSON_DIRECCION_ENVIO == undefined)?null:params.JSON_DIRECCION_ENVIO;
        params.JSON_NOTAS_PEDIDO      = (params.JSON_NOTAS_PEDIDO == undefined)?null:params.JSON_NOTAS_PEDIDO;
        params.ESTATUS      = (params.ESTATUS == undefined)?null:params.ESTATUS;

        if(params.ESTATUS || params.ID_USUARIO || params.NUM_TOTAL || params.JSON_DIRECCION_ENVIO || params.JSON_DIRECCION_FACTURA || params.JSON_NOTAS_PEDIDO){
            let pedi = await pool.query(consulta.get(PEDIDOS.TABLA, id));
            if(pedi.length == 0){
                return res.status(400).send({
                    'message': 'Pedido no existe'
                });
            }

            pedi = pedi[0]

            //Guardar en la base de datos
            const data = {
                ID: id,
                ID_USUARIO: (params.ID_USUARIO == null)?pedi.ID_USUARIO:params.ID_USUARIO,
                NUM_TOTAL: (params.NUM_TOTAL == null)?pedi.NUM_TOTAL:params.NUM_TOTAL,
                JSON_DIRECCION_ENVIO: (params.JSON_DIRECCION_ENVIO == null)?pedi.JSON_DIRECCION_ENVIO:JSON.stringify(params.JSON_DIRECCION_ENVIO),
                JSON_DIRECCION_FACTURA: (params.JSON_DIRECCION_FACTURA == null)?pedi.JSON_DIRECCION_FACTURA:JSON.stringify(params.JSON_DIRECCION_FACTURA),
                JSON_NOTAS_PEDIDO: (params.JSON_NOTAS_PEDIDO == null)?pedi.JSON_NOTAS_PEDIDO:JSON.stringify(params.JSON_NOTAS_PEDIDO),
                FECHA: pedi.FECHA,
                ESTATUS:  (params.ESTATUS == null)?pedi.ESTATUS:params.ESTATUS
            }

            try{
                consulta.funciones.update(PEDIDOS.TABLA, data);
    
            }catch(e){
                return res.status(400).send({
                    'message': 'Datos incorrecto, intentelo de nuevo'
                });
            }

           return res.status(200).send({
                'message': 'Pedido registrado con exito',
                'pedidos': data
           }); 
           
        }else{
            return res.status(400).send({
                'message': 'Datos incorrecto, intentelo de nuevo'
            });
        }

       
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(PEDIDOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Pedidos eliminado exitosamente',
         
        });
    }
}

module.exports = pedidos