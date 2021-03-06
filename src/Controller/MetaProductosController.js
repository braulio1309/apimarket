//Librerías y servicios
const validator = require('validator');
const METAPRODUCTOS = require('../Models/Meta_productos');
const PRODUCTOS = require('../Models/PRODUCTOs');
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
        params.ID_PRODUCTO   = (params.ID_PRODUCTO == undefined)?'':params.ID_PRODUCTO;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_PRODUCTO_id  = !validator.isEmpty(params.ID_PRODUCTO);



        if(validate_DES_META_KEY && validate_DES_META_VALUE && validate_PRODUCTO_id){
            
            //valido que el PRODUCTO exista
            const PRODUCTO = await pool.query(consulta.get(PRODUCTOS.TABLA, params.ID_PRODUCTO));

            if(PRODUCTO.length == 0){
                return res.status(400).send({
                    'message': 'PRODUCTO inexistente'
                });
            }

            //Verificamos si ya existe el metadato 
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPRODUCTOS.TABLA} WHERE ${METAPRODUCTOS.ID_PRODUCTO} = ${params.ID_PRODUCTO} 
            AND ${METAPRODUCTOS.KEY} = '${params.DES_META_KEY}' 
            AND ${METAPRODUCTOS.VALUE} = '${params.DES_META_VALUE}'`));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    ID_PRODUCTO: params.ID_PRODUCTO,
                    DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:params.DES_META_VALUE,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(METAPRODUCTOS.TABLA, data)){
                    return res.status(200).send({
                        'message': 'metadato registrado exitosamente',
                        'metaPRODUCTO': data
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
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM meta_productos', null)
        

         return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('meta_productos', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_META_KEY   = (params.DES_META_KEY == undefined)?'':params.DES_META_KEY;
        params.DES_META_VALUE   = (params.DES_META_VALUE == undefined)?'':params.DES_META_VALUE;
        params.ID_PRODUCTO   = (params.ID_PRODUCTO == undefined)?'':params.ID_PRODUCTO;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_META_KEY    = !validator.isEmpty(params.DES_META_KEY);
        let validate_DES_META_VALUE  = !validator.isEmpty(params.DES_META_VALUE);
        let validate_PRODUCTO_id  = !validator.isEmpty(params.ID_PRODUCTO);

        if((validate_DES_META_KEY || validate_DES_META_VALUE) || validate_PRODUCTO_id){
           
             //Valido duplicidad
             console.log(consulta.custom(`SELECT * FROM ${METAPRODUCTOS.TABLA} WHERE ${METAPRODUCTOS.ID_PRODUCTO} = ${params.ID_PRODUCTO} 
             AND ${METAPRODUCTOS.KEY} = '${params.DES_META_KEY}' 
             AND ${METAPRODUCTOS.VALUE} = '${params.DES_META_VALUE}'`))
             const verifica = await pool.query(consulta.custom(`SELECT * FROM ${METAPRODUCTOS.TABLA} WHERE ${METAPRODUCTOS.ID_PRODUCTO} = '${params.ID_PRODUCTO}' 
             AND ${METAPRODUCTOS.KEY} = '${params.DES_META_KEY}' 
             AND ${METAPRODUCTOS.VALUE} = '${params.DES_META_VALUE}'`));          

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(METAPRODUCTOS.TABLA, id));

            if(meta.length == 0){
                return res.status(400).send({
                    'message': 'metadato no existe'
                });
            }else{
                //Valido la entrada de datos
                meta = meta[0]

                let data = {
                    ID: id,
                    ID_PRODUCTO: meta.ID_PRODUCTO,
                    DES_META_KEY:(params.DES_META_KEY == '')?meta.DES_META_DES_META_KEY:params.DES_META_KEY,
                    DES_META_VALUE:(params.DES_META_VALUE == '')?meta.DES_META_DES_META_VALUE:params.DES_META_VALUE,
                    ESTATUS: (params.estatus != '')?meta.ESTATUS:params.ESTATUS,
                    FECHA: meta.FECHA
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(METAPRODUCTOS.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(METAPRODUCTOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = meta;