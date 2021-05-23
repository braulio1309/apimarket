//Librerías y servicios
const validator = require('validator');
let Usuario = require('../Models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

const dotenv = require("dotenv");
dotenv.config();




const date = new Date();


const usuario = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.DES_NOMBRE   = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_APELLIDO = (params.DES_APELLIDO == undefined)?'':params.DES_APELLIDO;
        params.DES_CORREO    = (params.DES_CORREO == undefined)?'':params.DES_CORREO;
        params.DES_PASS = (params.DES_PASS == undefined)?'':params.DES_PASS;
        params.DES_USUARIO  = (params.DES_USUARIO == undefined)?'':params.DES_USUARIO;

        let validate_DES_NOMBRE     = !validator.isEmpty(params.DES_NOMBRE);
        let validate_DES_APELLIDO   = !validator.isEmpty(params.DES_APELLIDO);
        let validate_DES_CORREO      = !validator.isEmpty(params.DES_CORREO) && validator.isEmail(params.DES_CORREO);
        let validate_pass       = !validator.isEmpty(params.DES_PASS);
        let validate_user       = !validator.isEmpty(params.DES_USUARIO);

        if(validate_DES_NOMBRE && validate_pass && validate_DES_CORREO){
            //Verificamos si existe
            let user =  Usuario;

            user.DES_NOMBRE = params.DES_NOMBRE;
            user.DES_APELLIDO = params.DES_APELLIDO;
            user.DES_PASS = params.DES_PASS;
            user.DES_USUARIO  = params.DES_USUARIO;
            user.rol = null;
            user.DES_CORREO = params.DES_CORREO;

            
            //Si da true el DES_USUARIO existe
            //let verifica = user.findOne();
            
            const verifica = await pool.query(consulta.search('USUARIOS', 'DES_CORREO', user.DES_CORREO, 'equals'))
            
           console.log(verifica.length)
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'Usuario ya existe'
                });
            }else{
                //Guardo en la base de datos
                bcrypt.hash(params.DES_PASS, 4, async function(err, hash) {
                    user.DES_PASS = hash;
                    let data = {
                       DES_NOMBRE: user.DES_NOMBRE,
                       DES_USUARIO: user.DES_USUARIO,
                       DES_PASS:user.DES_PASS,
                       DES_CORREO:user.DES_CORREO,
                       DES_APELLIDO:user.DES_APELLIDO,
                       FECHA: date,
                       ESTATUS: 1
                    }
                    
                    if(consulta.funciones.insertTable('USUARIOS', data)){
                        return res.status(200).send({
                            'message': 'Usuario registrado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al guardar el DES_USUARIO',
                           
                        }); 
                    }
                });
            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }
    },

    mostrar: async function(req, res){
       
        let user =  await pool.query(consulta.list('DES_USUARIOs'))
        return res.status(200).send({
            'lista': user
        })
        
    },

    login:async function(req, res){

        let params = req.body;

        //Validamos datos
        params.DES_CORREO    = (params.DES_CORREO == undefined)?'':params.DES_CORREO;
        params.DES_PASS = (params.DES_PASS == undefined)?'':params.DES_PASS;

        let validate_DES_CORREO      = !validator.isEmpty(params.DES_CORREO) && validator.isEmail(params.DES_CORREO);
        let validate_pass       = !validator.isEmpty(params.DES_PASS);
        let user = Usuario;
        if(validate_DES_CORREO && validate_pass){

            //Buscar DES_USUARIO si coincide
            const verifica = await pool.query(consulta.search('USUARIOS', 'DES_CORREO', user.DES_CORREO, 'equals'))
            if(verifica){

                //Verificamos la contraseña
                user.DES_CORREO = params.DES_CORREO;
                user.DES_PASS = params.DES_PASS;
                console.log(consulta.custom(`SELECT * FROM DES_USUARIOs WHERE DES_CORREO = '${user.DES_CORREO}'`))
                let DES_USUARIO = await pool.query(consulta.custom(`SELECT * FROM DES_USUARIOs WHERE DES_CORREO = '${user.DES_CORREO}'`));

                console.log(DES_USUARIO)
                bcrypt.compare(params.DES_PASS, DES_USUARIO[0].DES_PASS, (err, check) => {
                    
                    if(check){
                        //generamos JWT
                        if(params.gettoken){
                            return res.status(200).send({
                               token: jwt.createToken(DES_USUARIO[0]),

                            }); 
                        }

                    }else{
                        return res.status(400).send({
                            'message': 'El DES_USUARIO no existe'
                        });
                    }
                })
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }

        
    },

    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        params.DES_NOMBRE   = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.DES_APELLIDO = (params.DES_APELLIDO == undefined)?'':params.DES_APELLIDO;
        params.DES_CORREO    = (params.DES_CORREO == undefined)?'':params.DES_CORREO;
        params.DES_PASS = (params.DES_PASS == undefined)?'':params.DES_PASS;
        params.DES_USUARIO  = (params.DES_USUARIO == undefined)?'':params.DES_USUARIO;
        
        let validate_DES_NOMBRE     = !validator.isEmpty(params.DES_NOMBRE);
        let validate_DES_APELLIDO   = !validator.isEmpty(params.DES_APELLIDO);
        let validate_DES_CORREO      = !validator.isEmpty(params.DES_CORREO) && validator.isEmail(params.DES_CORREO);
        let validate_pass       = !validator.isEmpty(params.DES_PASS);
        let validate_user       = !validator.isEmpty(params.DES_USUARIO);
       
       

        if((validate_DES_NOMBRE || validate_DES_APELLIDO || validate_DES_CORREO|| validate_pass || validate_user) && req.user.sub == id){ //Valido que solo el DES_USUARIO pueda modificar su propio DES_USUARIO
            let user =  Usuario;

            //Valido duplicidad
            if(params.DES_CORREO != ''){
                let DES_CORREO =  await pool.query(consulta.search('USUARIOS', 'DES_CORREO', params.DES_CORREO, 'equals'))
                if(DES_CORREO.length != 0){
                    return res.status(400).send({
                        'message': 'El correo ya fue tomado'
                    });
                }
            }

            //Busco el DES_USUARIO a actualizar y verifico si existe
            let DES_USUARIO =  await pool.query(consulta.get("DES_USUARIOs", id));

            if(DES_USUARIO.length == 0){
                return res.status(400).send({
                    'message': 'Usuario no existe'
                });
            }else{
                //Valido la entrada de datos
                DES_USUARIO = DES_USUARIO[0]
                user.DES_NOMBRE   = (params.DES_NOMBRE == '')?DES_USUARIO.DES_NOMBRE:params.DES_NOMBRE;
                user.DES_APELLIDO = (params.DES_APELLIDO == '')?DES_USUARIO.DES_APELLIDO: params.DES_APELLIDO;
                user.DES_PASS = (params.DES_PASS == '')?DES_USUARIO.DES_PASS:params.DES_PASS;
                user.DES_USUARIO  = (params.DES_USUARIO == '')?DES_USUARIO.DES_USUARIO:params.DES_USUARIO;
                user.DES_CORREO    = (params.DES_CORREO == '')?DES_USUARIO.DES_CORREO:params.DES_CORREO;

                let data = {
                    ID: id,
                    DES_NOMBRE: user.DES_NOMBRE,
                    DES_APELLIDO: user.DES_APELLIDO,
                    DES_CORREO:user.DES_CORREO,
                    DES_PASS:user.DES_PASS,
                    DES_USUARIO: user.DES_USUARIO
                }
                //Guardo en la base de datos
                if(params.DES_PASS == undefined){
                    if(consulta.funciones.update('DES_USUARIOs', data)){
                        return res.status(200).send({
                            'message': 'Usuario actualizado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al actualizar el DES_USUARIO',
                           
                        }); 
                    }
                }else{
                    bcrypt.hash(params.DES_PASS, 4, function(err, hash) {
                        data.DES_PASS = hash;
                        if(consulta.funciones.update('DES_USUARIOs', data)){
                            return res.status(200).send({
                                'message': 'Usuario actualizado exitosamente',
                                'user': data
                            }); 
                        }else{
                            return res.status(400).send({
                                'message': 'Error al actualizar el DES_USUARIO',
                               
                            }); 
                        }
                        
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
        if(req.user.sub == req.params.id){
            //console.log('sda')
            const borrar = await pool.query(consulta.remove('DES_USUARIOs', req.user.sub));
            return res.status(200).send({
                'message': 'Usuario eliminado exitosamente',
                'user': req.user
            }); 
        }else{
            return res.status(400).send({
                'message': 'El DES_USUARIO no tiene permiso para realizar esta acción'
            });
        }
    },

    login_fb:async function(req, res){
        // Passport session setup.
        
        console.log(process.env.FACEBOOK_CLIENT_ID)
        passport.use(
            new FacebookStrategy(
              {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL,
                profileFields: ["email", "name"]
              },
              function(accessToken, refreshToken, profile, done) {
                const { email, first_name, last_name } = profile._json;
                const userData = {
                  email,
                  firstName: first_name,
                  lastName: last_name
                };
                //new userModel(userData).save();
                done(null, profile);
              }
            )
        )

    }

}

module.exports = usuario;