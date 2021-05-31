//Librerías y servicios
const validator = require('validator');
const ZONAS = require('../Models/Zonas_envios');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const zonas = {
    
    crear: async function(req, res){
        let params = req.body;

        const id = req.params.id;
        
        //Validar datos
        params.DES_NOMBRE              = (params.DES_NOMBRE == undefined)? '':params.NUM_TOTAL;
        params.REGION_ZONA = (params.REGION_ZONA == undefined)?null:params.JSON_DIRECCION_FACTURA;
        params.JSON_METODOS_ENVIO   = (params.JSON_METODOS_ENVIO == undefined)?null:params.JSON_DIRECCION_ENVIO;
        params.REGION_ZONA      = (params.REGION_ZONA == undefined)?null:params.JSON_NOTAS_PEDIDO;
        
        let validate_DES_NOMBRE   = !validator.isEmpty(params.DES_NOMBRE);

        if(validate_DES_NOMBRE){

            //validamos que no exista ese nombre
             //Verificamos si ya existe el impuesto
             const verifica = await pool.query(consulta.search(ZONAS.TABLA, ZONAS.NOMBRE, params.DES_NOMBRE, 'equals' ));
            
             if(verifica.length > 0){
                 return res.status(400).send({
                     'message': 'La zona  ya existe'
                 });
             }

             const data = {
                DES_NOMBRE: params.DES_NOMBRE,
                REGION_ZONA: params.REGION_ZONA,
                JSON_METODOS_ENVIO:params.JSON_METODOS_ENVIO,
                ID_USUARIO_ALTA: req.user.sub,
                ESTATUS:1, 
                FECHA: date
            }
    
            try{
                consulta.funciones.insertTable(ZONAS.TABLA, data);
    
            }catch(e){
                return res.status(400).send({
                    'message': 'Datos incorrecto, intentelo de nuevo'
                });
            }
           return res.status(200).send({
                'message': 'Zona registrado con exito',
                'pedidos': data
           }); 
        }else{
            return res.status(400).send({
                'message': 'Error al guardar la zona',
                
            }); 
        }
       
    },

    mostrar:async function(req, res){
        //let user =  await pool.query(consulta.list('DES_USUARIOs'))
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM zonas_envios', null)
        

        return user
    },

    update:async function(req, res){
        const id = req.params.id;

                
        //Validar datos
        params.DES_NOMBRE              = (params.DES_NOMBRE == undefined)? '':params.NUM_TOTAL;
        params.REGION_ZONA = (params.REGION_ZONA == undefined)?null:params.JSON_DIRECCION_FACTURA;
        params.JSON_METODOS_ENVIO   = (params.JSON_METODOS_ENVIO == undefined)?null:params.JSON_DIRECCION_ENVIO;
        params.ESTATUS      = (params.ESTATUS == undefined)?null:params.ESTATUS;

        let validate_DES_NOMBRE   = !validator.isEmpty(params.DES_NOMBRE);

        if(validate_DES_NOMBRE || params.REGION_ZONA || params.JSON_METODOS_ENVIO || params.ESTATUS){

            //Verificamos si existe 
            let zona = await pool.query(consulta.get(ZONAS.TABLA, id));

            if(zona.length == 0){
                return res.status(400).send({
                    'message': 'La zona  no existe'
                });
            }
            zona = zona[0]
            
            //validamos que no exista ese nombre
             const verifica = await pool.query(consulta.search(ZONAS.TABLA, ZONAS.NOMBRE, params.DES_NOMBRE, 'equals' ));
            
             if(verifica.length > 1){
                 return res.status(400).send({
                     'message': 'La zona  ya existe'
                 });
             }

             const data = {
                 ID: id,
                DES_NOMBRE: (params.DES_NOMBRE != null)?zona.DES_NOMBRE:params.DES_NOMBRE,
                REGION_ZONA: (params.REGION_ZONA != null)?zona.REGION_ZONA:params.REGION_ZONA,
                JSON_METODOS_ENVIO:(params.JSON_METODOS_ENVIO != null)?zona.JSON_METODOS_ENVIO:params.JSON_METODOS_ENVIO,
                ID_USUARIO_ALTA: req.user.sub,
                ESTATUS:(params.ESTATUS != null)?zona.ESTATUS:params.ESTATUS, 
                FECHA: zona.FECHA
            }
    
            try{
                consulta.funciones.update(ZONAS.TABLA, data);
    
            }catch(e){
                return res.status(400).send({
                    'message': 'Datos incorrecto, intentelo de nuevo'
                });
            }
           return res.status(200).send({
                'message': 'Zona registrado con exito',
                'zona': data
           }); 
        }else{
            return res.status(400).send({
                'message': 'Error al guardar la zona',
                
            }); 
        }
       

       
    },

    delete:async function(req, res) {
        const borrar = await pool.query(consulta.remove(ZONAS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Pedidos eliminado exitosamente',
         
        });
    }
}

module.exports = zonas