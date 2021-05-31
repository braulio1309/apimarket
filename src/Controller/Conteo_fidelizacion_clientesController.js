//Librerías y servicios
const validator = require('validator');
const CONTEO = require('../Models/Conteo_fidelizacion_clientes');
const FIDELIZACION = require('../Models/Fidelizacion_clientes');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const cupones = {
    
    crear: async function(req, res){
        let params = req.body;

        const ID_REGISTRO_FIDELIZACION_CLIENTE = req.params.ID_REGISTRO_FIDELIZACION_CLIENTE;
        const ID_FIDELIZACION_CLIENTE = req.params.ID_FIDELIZACION_CLIENTE;
        //Validar datos
        params.ID_TOKEN_URL       = (params.ID_TOKEN_URL == undefined)?null:params.ID_TOKEN_URL;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?null:params.ID_USUARIO;
        params.DES_IP     = (params.DES_IP == undefined)?null:params.DES_IP;
        params.DES_ID_NAVEGADOR          = (params.DES_ID_NAVEGADOR == undefined)?'':params.DES_ID_NAVEGADOR;
        params.ID_REGISTRO_FIDELIZACION_CLIENTE       = (params.ID_REGISTRO_FIDELIZACION_CLIENTE == undefined)?null:params.ID_REGISTRO_FIDELIZACION_CLIENTE;
        params.ID_FIDELIZACION_CLIENTE       = (params.ID_FIDELIZACION_CLIENTE == undefined)?null:params.ID_FIDELIZACION_CLIENTE;
       

        if(params.ID_TOKEN_URL &&  params.ID_USUARIO ){


            //Valido que el usuario exista
            const nombre = await pool.query(consulta.get(USUARIOS.TABLA, params.ID_USUARIO));
            if(nombre.length == 0){
                return res.status(400).send({
                    'message': 'El usuario no existe'
                });
            }

             //Valido que el usuario exista
             const fide = await pool.query(consulta.get(FIDELIZACION.TABLA, params.ID_FIDELIZACION_CLIENTE));
             if(fide.length == 0){
                 return res.status(400).send({
                     'message': 'El fide no existe'
                 });
             }

            //Guardar en la base de datos
            const data = {
                ID_USUARIO:params.ID_USUARIO,
                DES_ID_NAVEGADOR:params.DES_ID_NAVEGADOR,
                ID_TOKEN_URL:params.ID_TOKEN_URL,
                ID_FIDELIZACION_CLIENTE: params.ID_FIDELIZACION_CLIENTE,
                ID_REGISTRO_FIDELIZACION_CLIENTE: params.ID_REGISTRO_FIDELIZACION_CLIENTE,
                FECHA: date,
                ESTATUS: 1
            }

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
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM conteo_fidelizacion_clientes', null)
        

         return user
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        const ID_FIDELIZACION_CLIENTE = req.params.ID_FIDELIZACION_CLIENTE
        const ID_REGISTRO_FIDELIZACION_CLIENTE = req.params.ID_REGISTRO_FIDELIZACION_CLIENTE

        params.ID_TOKEN_URL       = (params.ID_TOKEN_URL == undefined)?'':params.ID_TOKEN_URL;
        params.ID_USUARIO         = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
        params.DES_IP     = (params.DES_IP == undefined)?0:params.DES_IP;
        params.DES_ID_NAVEGADOR          = (params.DES_ID_NAVEGADOR == undefined)?'':params.DES_ID_NAVEGADOR;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        
        if(params.ID_TOKEN_URL || params.ID_USUARIO || params.DES_IP  || params.DES_IP || params.DES_ID_NAVEGADOR || params.DES_ID_NAVEGADOR ||params.ESTATUS){

            //Valido si el cupon existe
            const cupon = await pool.query(consulta.custom(`SELECT * FROM conteo_fidelizacion_clientes WHERE ID_FIDELIZACION_CLIENTE = ${ID_FIDELIZACION_CLIENTE} AND ID_REGISTRO_FIDELIZACION_CLIENTE = ${ID_REGISTRO_FIDELIZACION_CLIENTE}`));

            if(cupon.length == 0){
                return res.status(400).send({
                    'message': 'registro no existe'
                });
            }
           
            produc = produc[0]
            //Guardar en la base de datos
            const data = {
                ID: id,
                ID_USUARIO:(params.ID_USUARIO == '')?produc.ID_USUARIO:params.ID_USUARIO,
                DES_ID_NAVEGADOR:(params.DES_ID_NAVEGADOR == '')?produc.DES_SKU_PRODUCTO:params.DES_ID_NAVEGADOR,
                ID_TOKEN_URL:(params.ID_TOKEN_URL == '')?produc.ID_TOKEN_URL:params.ID_TOKEN_URL,
                ID_FIDELIZACION_CLIENTE: params.ID_FIDELIZACION_CLIENTE,
                ID_REGISTRO_FIDELIZACION_CLIENTE: params.ID_REGISTRO_FIDELIZACION_CLIENTE,
                FECHA: produc.FECHA,
                ESTATUS:  (params.ESTATUS == '')?produc.ESTATUS:params.ESTATUS
            }

            try{
                await pool.query(consulta.custom(`UPDATE conteo_fidelizacion_clientes
                SET ID_USUARIO=${data.ID_USUARIO}, DES_ID_NAVEGADOR='${data.DES_ID_NAVEGADOR}, ID_TOKEN_URL=${data.ID_TOKEN_URL}, ESTATUS = ${data.ESTATUS}
                WHERE ID_FIDELIZACION_CLIENTE = ${ID_FIDELIZACION_CLIENTE} AND ID_REGISTRO_FIDELIZACION_CLIENTE = ${ID_REGISTRO_FIDELIZACION_CLIENTE}`));

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

        const ID_FIDELIZACION_CLIENTE = req.params.ID_FIDELIZACION_CLIENTE
        const ID_REGISTRO_FIDELIZACION_CLIENTE = req.params.ID_REGISTRO_FIDELIZACION_CLIENTE
        
        const borrar = await pool.query(consulta.custom(`DELETE FROM conteo_fidelizacion_clientes WHERE ID_FIDELIZACION_CLIENTE = ${ID_FIDELIZACION_CLIENTE} AND ID_REGISTRO_FIDELIZACION_CLIENTE = ${ID_REGISTRO_FIDELIZACION_CLIENTE}`));
        return res.status(200).send({
            'message': 'Cupón eliminado exitosamente',
         
        });
    }
}

module.exports = cupones