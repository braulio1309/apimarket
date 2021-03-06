//Librerías y servicios
const validator = require('validator');
const METATIENDAS = require('../Models/Meta_tiendas');
const TIENDAS = require('../Models/Tiendas');
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
        params.ID_TIENDA   = (params.ID_TIENDA == undefined)?'':params.ID_TIENDA;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_TIENDA_id  = !validator.isEmpty(params.ID_TIENDA);



        if(validate_DES_META_KEY && validate_DES_META_VALUE && validate_TIENDA_id){
            
            //valido que el TIENDA exista
            const TIENDA = await pool.query(consulta.get(TIENDAS.TABLA, params.ID_TIENDA));

            if(TIENDA.length == 0){
                return res.status(400).send({
                    'message': 'TIENDA inexistente'
                });
            }

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METATIENDAS.TABLA} WHERE ${METATIENDAS.ID_TIENDA} = ${params.ID_TIENDA} 
            AND ${METATIENDAS.KEY} = '${params.DES_META_KEY}' 
            AND ${METATIENDAS.VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_TIENDA: params.ID_TIENDA,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METATIENDAS.TABLA, data)){
                    return res.status(200).send({
                        'message': 'metadato registrado exitosamente',
                        'metaTIENDA': data
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
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM meta_tiendas', null)
        

         return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('meta_tiendas', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_TIENDA   = (params.ID_TIENDA == undefined)?'':params.ID_TIENDA;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_TIENDA_id  = !validator.isEmpty(params.ID_TIENDA);

        if((validate_DES_META_KEY || validate_DES_META_VALUE|| params.ESTATUS != '') || validate_TIENDA_id){
           
             //Valido duplicidad
            
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METATIENDAS.TABLA} WHERE ${METATIENDAS.ID_TIENDA} = '${params.ID_TIENDA}' 
            AND (${METATIENDAS.KEY} = '${params.DES_META_KEY}' 
            AND ${METATIENDAS.VALUE} = '${params.DES_META_VALUE}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METATIENDAS.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_TIENDA: meta.ID_TIENDA,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.ESTATUS == '')?meta.ESTATUS:params.ESTATUS,
                    FECHA: meta.FECHA
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METATIENDAS.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(METATIENDAS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = meta;