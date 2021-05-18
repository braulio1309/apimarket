//Librerías y servicios
const validator = require('validator');
const METAUSUARIOS = require('../Models/MetaUsuarios');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

let metaUsuarios = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);


        if(validate_key && validate_value){
            
            //Verificamos si existe
           
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAUSUARIOS.TABLA} WHERE ${METAUSUARIOS.ID_USUARIO} = ${req.user.sub} 
            AND ${METAUSUARIOS.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAUSUARIOS.DES_META_VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_USUARIO: req.user.sub,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METAUSUARIOS.TABLA, data)){
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
       
        let meta =  await pool.query(consulta.list(METAUSUARIOS.TABLA))
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

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);

        if(validate_key || validate_value){
           
             //Valido duplicidad
           
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAUSUARIOS.TABLA} WHERE ${METAUSUARIOS.ID_USUARIO} = ${req.user.sub} 
            AND (${METAUSUARIOS.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAUSUARIOS.DES_META_VALUE} = '${params.DES_META_VALUE}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METAUSUARIOS.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_USUARIO: meta.ID_USUARIO,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.estatus == '')?meta.ESTATUS:params.estatus,
                    FECHA: meta.FECHA
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METAUSUARIOS.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(METAUSUARIOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = metaUsuarios;