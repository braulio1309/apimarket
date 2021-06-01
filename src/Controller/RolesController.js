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
        params.DES_ROL   = (params.DES_ROL == undefined)?'':params.DES_ROL;

        let validate_rol    = !validator.isEmpty(params.DES_ROL);
       

        if(validate_rol){
            
            //Verificamos si existe
            const verifica = await pool.query(consulta.search(Roles.TABLA, Roles.NOMBRE_ROL, params.DES_ROL, 'equals'))
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'DES_ROL ya existe'
                });
            }else{
                //Guardo en la base de datos
              
                
                const data = {
                    DES_ROL:params.DES_ROL,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(Roles.TABLA, data)){
                    return res.status(200).send({
                        'message': 'roles registrado exitosamente',
                        'DES_ROL': data
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
       
        //let user =  await pool.query(consulta.list('DES_USUARIOs'))
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM roles', null)
        

        return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('roles', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        params.DES_ROL   = (params.DES_ROL == undefined)?'':params.DES_ROL;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

       
        let validate_rol     = !validator.isEmpty(params.DES_ROL);
        let validate_estatus     = !validator.isEmpty(params.ESTATUS);       

        if(validate_rol || validate_estatus){ //Valido que es admin
           
             //Valido duplicidad
            if(params.DES_ROL != ''){
                const rol_nombre =  await pool.query(consulta.search(Roles.TABLA, Roles.NOMBRE_ROL, params.DES_ROL, 'equals'))
                if(rol_nombre.length != 0){
                    return res.status(400).send({
                        'message': 'El DES_ROL ya fue creado'
                    });
                }
            }

            //Busco el DES_ROL a actualizar y verifico si existe
            let roles =  await pool.query(consulta.get(Roles.TABLA, id));

            if(roles.length == 0){
                return res.status(400).send({
                    'message': 'DES_ROL no existe'
                });
            }else{
                //Valido la entrada de datos
                roles = roles[0]

                let data = {
                    ID: id,
                    DES_ROL:(params.DES_ROL == '')?roles.DES_ROL:params.DES_ROL,
                    ESTATUS: (params.ESTATUS == '')?roles.ESTATUS:params.ESTATUS,
                }

                //Guardo en la base de datos
                if(consulta.funciones.update(Roles.TABLA, data)){
                    return res.status(200).send({
                        'message': 'DES_ROL actualizado exitosamente',
                        'DES_ROL': data
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