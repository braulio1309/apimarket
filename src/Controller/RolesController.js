//Librerías y servicios
const validator = require('validator');
const Roles = require('../Models/Roles');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

let roles = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.rol   = (params.rol == undefined)?'':params.rol;

        let validate_rol    = !validator.isEmpty(params.rol);
       

        if(validate_rol){
            
            //Verificamos si existe
            const verifica = await pool.query(consulta.search(Roles.TABLA, Roles.NOMBRE_ROL, params.rol, 'equals'))
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'rol ya existe'
                });
            }else{
                //Guardo en la base de datos
              
                
                const data = {
                    DES_ROL:params.rol,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(Roles.TABLA, data)){
                    return res.status(200).send({
                        'message': 'roles registrado exitosamente',
                        'rol': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al guardar el roles',
                        
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
       
        let roles =  await pool.query(consulta.list(Roles.TABLA))
        return res.status(200).send({
            'lista': roles
        })
        
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        params.rol   = (params.rol == undefined)?'':params.rol;
        params.estatus   = (params.estatus == undefined)?'':params.estatus;

       
        let validate_rol     = !validator.isEmpty(params.rol);
        let validate_estatus     = !validator.isEmpty(params.estatus);       

        if(validate_rol || validate_estatus){ //Valido que es admin
           
             //Valido duplicidad
            if(params.rol != ''){
                const rol_nombre =  await pool.query(consulta.search(Roles.TABLA, Roles.NOMBRE_ROL, params.rol, 'equals'))
                if(rol_nombre.length != 0){
                    return res.status(400).send({
                        'message': 'El rol ya fue creado'
                    });
                }
            }

            //Busco el rol a actualizar y verifico si existe
            let roles =  await pool.query(consulta.get(Roles.TABLA, id));

            if(roles.length == 0){
                return res.status(400).send({
                    'message': 'rol no existe'
                });
            }else{
                //Valido la entrada de datos
                roles = roles[0]

                let data = {
                    ID: id,
                    DES_ROL:(params.rol == '')?roles.DES_ROL:params.rol,
                    ESTATUS: (params.estatus == '')?roles.ESTATUS:params.estatus,
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(Roles.TABLA, data)){
                    return res.status(200).send({
                        'message': 'rol actualizado exitosamente',
                        'rol': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al actualizar el roles',
                        
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
       
        const borrar = await pool.query(consulta.remove(Roles.TABLA, req.user.sub));
        return res.status(200).send({
            'message': 'roles eliminado exitosamente',
         
        });
        
    }

}

module.exports = roles;