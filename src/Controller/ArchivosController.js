//Librerías y servicios
const validator = require('validator');
const ARCHIVOS = require('../Models/Archivos');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();
const fs = require('fs');

const ag = {

     subir:  function(req, res) {
        let params = req.body
        console.log(params.hola);
        /*var tmp_path = req.files.photo.path;
        // Ruta donde colocaremos las imagenes
        var target_path = '../public/images/' + req.files.photo.name;
       // Comprobamos que el fichero es de tipo imagen
        if (req.files.photo.type.indexOf('image')==-1){
                    res.send('El fichero que deseas subir no es una imagen');
        } else {
             // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // Eliminamos el fichero temporal
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                     console.log('ddd')
                });
             });
         }*/
    },

    mostrar: async function(req, res){
       
        let meta =  await pool.query(consulta.list(ARCHIVOS.TABLA))
        return res.status(200).send({
            'lista': meta
        })
        
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
        //Validar datos
        params.DES_NOMBRE_ARCHIVO   = (params.DES_NOMBRE_ARCHIVO == undefined)?'':params.DES_NOMBRE_ARCHIVO;
        params.DES_URL_RUTA   = (params.DES_URL_RUTA == undefined)?'':params.DES_URL_RUTA;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_key    = !validator.isEmpty(params.DES_NOMBRE_ARCHIVO);
        let validate_value  = !validator.isEmpty(params.DES_URL_RUTA);
       

        if((validate_key || validate_value) && validate_rol_id){
           
             //Valido duplicidad
            const verifica = await pool.query(consulta.custom(`SELECT * FROM ${ARCHIVOS.TABLA} WHERE ${ARCHIVOS.ID_USUARIO} = ${req.user.sub} 
            AND (${ARCHIVOS.DES_NOMBRE_ARCHIVO} = '${params.DES_NOMBRE_ARCHIVO}' 
            AND ${ARCHIVOS.DES_URL_RUTA} = '${params.DES_URL_RUTA}')`));                

            if(verifica.length != 0){
                return res.status(400).send({
                    'message': 'El metadato ya fue creado'
                });
            }
            

            //Busco el metadato a actualizar y verifico si existe
            let meta =  await pool.query(consulta.get(ARCHIVOS.TABLA, id));

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
                    DES_NOMBRE_ARCHIVO:(params.DES_NOMBRE_ARCHIVO == '')?meta.DES_NOMBRE_ARCHIVO:params.DES_NOMBRE_ARCHIVO,
                    DES_URL_RUTA:(params.DES_URL_RUTA == '')?meta.DES_URL_RUTA:params.DES_URL_RUTA,
                    ESTATUS: (params.ESTATUS == '')?meta.ESTATUS:params.ESTATUS,
                    FECHA: meta.FECHA,
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(ARCHIVOS.TABLA, data)){

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
       
        const borrar = await pool.query(consulta.remove(ARCHIVOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'metadato eliminado exitosamente',
         
        });
        
    }

}

module.exports = ag