//Librerías y servicios
const validator = require('validator');
const METAVARIABLES = require('../Models/Meta_variables');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

let metaroles = {

    crear:async function(req, res) {
       
        let params = req.body;

        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);


        if(validate_key && validate_value){

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAVARIABLES.TABLA} WHERE ${METAVARIABLES.ID_USUARIO_ALTA} = ${req.user.sub} 
            AND ${METAVARIABLES.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAVARIABLES.DES_META_VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_USUARIO_ALTA: req.user.sub,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METAVARIABLES.TABLA, data)){
                    return res.status(200).send({
                        'message': 'metadato registrado exitosamente',
                        'metaUsuario': data
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
       
        let meta =  await pool.query(consulta.list(METAVARIABLES.TABLA))
        return res.status(200).send({
            'lista': meta
        })
        
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);
       

        if((validate_key || validate_value) && validate_rol_id){
           
             //Valido duplicidad
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAVARIABLES.TABLA} WHERE ${METAVARIABLES.ID_USUARIO_ALTA} = ${req.user.sub} 
            AND (${METAVARIABLES.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAVARIABLES.DES_META_VALUE} = '${params.DES_META_VALUE}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METAVARIABLES.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_USUARIO_ALTA: meta.ID_USUARIO_ALTA,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.ESTATUS == '')?meta.ESTATUS:params.ESTATUS,
                    FECHA: meta.FECHA,
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METAVARIABLES.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(METAVARIABLES.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = metaroles;