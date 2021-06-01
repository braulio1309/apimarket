//Librerías y servicios
const validator = require('validator');
const METAPEDIDOS = require('../Models/Meta_pedidos');
const PEDIDOS = require('../Models/Pedidos');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const meta = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_PEDIDO   = (params.ID_PEDIDO == undefined)?'':params.ID_PEDIDO;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_pedido_id  = !validator.isEmpty(params.ID_PEDIDO);



        if(validate_DES_META_KEY && validate_DES_META_VALUE && validate_pedido_id){
            
            //valido que el pedido exista
            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA, params.ID_PEDIDO));

            if(pedido.length == 0){
                return res.status(400).send({
                    'message': 'pedido inexistente'
                });
            }

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPEDIDOS.TABLA} WHERE ${METAPEDIDOS.ID_PEDIDO} = '${params.ID_PEDIDO}' 
            AND ${METAPEDIDOS.KEY} = '${params.DES_META_KEY}' 
            AND ${METAPEDIDOS.VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_PEDIDO: params.ID_PEDIDO,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METAPEDIDOS.TABLA, data)){
                    return res.status(200).send({
                        'message': 'metadato registrado exitosamente',
                        'metaPedido': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al guardar el meta dato',
                        
                    }); 
                }
               
            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }
    },

    mostrar: async function(req, res){
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM meta_pedidos', null)
        

         return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('meta_pedidos', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_PEDIDO   = (params.ID_PEDIDO == undefined)?'':params.ID_PEDIDO;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_pedido_id  = !validator.isEmpty(params.ID_PEDIDO);

        if((validate_DES_META_KEY || validate_DES_META_VALUE) || validate_pedido_id || params.ESTATUS){
           
             //Valido duplicidad
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPEDIDOS.TABLA} WHERE ${METAPEDIDOS.ID_PEDIDO} = '${params.ID_PEDIDO}' 
            AND (${METAPEDIDOS.KEY} = '${params.DES_META_KEY}' 
            AND ${METAPEDIDOS.VALUE} = '${params.DES_META_VALUE}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METAPEDIDOS.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_PEDIDO: meta.ID_PEDIDO,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.ESTATUS == '')?meta.ESTATUS:params.ESTATUS,
                    FECHA: meta.FECHA
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METAPEDIDOS.TABLA, data)){

                    return res.status(200).send({
                        'message': 'metadato actualizado exitosamente',
                        'metadato': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al actualizar el metadato',
                        
                    }); 
                }
                       
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }

    },

    delete:async function(req, res){
       
        const borrar = await pool.query(consulta.remove(METAPEDIDOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = meta;