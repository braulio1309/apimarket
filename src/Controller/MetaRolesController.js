//Librerías y servicios
const validator = require('validator');
const METAROLES = require('../Models/MetaRoles');
const ROLES = require('../Models/Roles');
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
        params.ID_ROL   = (params.ID_ROL == undefined)?'':params.ID_ROL;

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_rol_id  = !validator.isEmpty(params.ID_ROL);



        if(validate_key && validate_value && validate_rol_id){
            
            //valido que el ID_ROL exista
            const ID_ROL = await pool.query(consulta.get(ROLES.TABLA, params.ID_ROL));

            if(ID_ROL.length == 0){
                return res.status(400).send({
                    'message': 'ID_ROL inexistente'
                });
            }

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAROLES.TABLA} WHERE ${METAROLES.ID_ROL} = ${params.ID_ROL} 
            AND ${METAROLES.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAROLES.DES_META_VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_ROL: params.ID_ROL,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METAROLES.TABLA, data)){
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
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM meta_roles', null)
        

        return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('meta_roles', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_ROL   = (params.ID_ROL == undefined)?'':params.ID_ROL;
        params.estatus   = (params.estatus == undefined)?'':params.estatus;

        let validate_key    = !validator.isEmpty(params.DES_META_KEY);
        let validate_value  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_rol_id  = !validator.isEmpty(params.ID_ROL);

        if((validate_key || validate_value) && validate_rol_id){
           
             //Valido duplicidad
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAROLES.TABLA} WHERE ${METAROLES.ID_ROL} = ${params.ID_ROL} 
            AND (${METAROLES.DES_META_KEY} = '${params.DES_META_KEY}' 
            AND ${METAROLES.DES_META_VALUE} = '${params.DES_META_VALUE}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METAROLES.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_ROL: meta.ID_ROL,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.estatus == '')?meta.ESTATUS:params.estatus,
                    FECHA: meta.FECHA
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METAROLES.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(METAROLES.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = metaroles;