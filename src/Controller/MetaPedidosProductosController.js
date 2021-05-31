//Librerías y servicios
const validator = require('validator');
const METAPEDIDOS = require('../Models/Meta_pedidos_productos');
const PEDIDOS = require('../Models/Pedidos_productos');
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
        params.ID_PEDIDO_PRODUCTO   = (params.ID_PEDIDO_PRODUCTO == undefined)?'':params.ID_PEDIDO_PRODUCTO;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_pedido_id  = !validator.isEmpty(params.ID_PEDIDO_PRODUCTO);



        if(validate_DES_META_KEY && validate_DES_META_VALUE && validate_pedido_id){
            
            //valido que el pedido exista
            const pedido = await pool.query(consulta.get(PEDIDOS.TABLA, params.ID_PEDIDO_PRODUCTO));

            if(pedido.length == 0){
                return res.status(400).send({
                    'message': 'pedido inexistente'
                });
            }

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPEDIDOS.TABLA} WHERE ${METAPEDIDOS.ID_PEDIDO_PRODUCTO} = ${params.ID_PEDIDO_PRODUCTO} 
            AND ${METAPEDIDOS.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAPEDIDOS.DES_META_VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_PEDIDO_PRODUCTO: params.ID_PEDIDO_PRODUCTO,
                    DES_META_DES_META_KEY:params.DES_META_KEY,
                    DES_META_DES_META_VALUE:params.DES_META_VALUE,
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
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM meta_pedidos_productos', null)
        

         return user
        
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_PEDIDO_PRODUCTO   = (params.ID_PEDIDO_PRODUCTO == undefined)?'':params.ID_PEDIDO_PRODUCTO;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_pedido_id  = !validator.isEmpty(params.ID_PEDIDO_PRODUCTO);

        if((validate_DES_META_KEY || validate_DES_META_VALUE) && validate_pedido_id){
           
             //Valido duplicidad
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPEDIDOS.TABLA} WHERE ${METAPEDIDOS.ID_PEDIDO_PRODUCTO} = ${params.ID_PEDIDO_PRODUCTO} 
            AND (${METAPEDIDOS.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAPEDIDOS.DES_META_VALUE} = '${params.DES_META_VALUE}')`));                

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
                    ID_pedido: meta.ID_PEDIDO_PRODUCTO,
                    DES_META_DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_DES_META_KEY:params.DES_META_KEY,
                    DES_META_DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.estatus == '')?meta.ESTATUS:params.ESTATUS,
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