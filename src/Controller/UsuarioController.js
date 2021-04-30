const validator = require('validator');
let Usuario = require('../Models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')

let usuario = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.apellido = (params.apellido == undefined)?'':params.apellido;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.usuario  = (params.usuario == undefined)?'':params.usuario;

        let validate_nombre     = !validator.isEmpty(params.nombre);
        let validate_apellido   = !validator.isEmpty(params.apellido);
        let validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_pass       = !validator.isEmpty(params.password);
        let validate_user       = !validator.isEmpty(params.usuario);

        if(validate_nombre && validate_pass && validate_email){
            //Verificamos si existe
            let user =  Usuario;

            user.nombre = params.nombre;
            user.apellido = params.apellido;
            user.password = params.password;
            user.usuario  = params.usuario;
            user.rol = null;
            user.email = params.email;

            
            //Si da true el usuario existe
            //let verifica = user.findOne();
            
            const verifica = await pool.query(consulta.search('USUARIOS', 'DES_CORREO', user.email, 'equals'))
            
           console.log(verifica.length)
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'Usuario ya existe'
                });
            }else{
                //Guardo en la base de datos
                bcrypt.hash(params.password, 4, async function(err, hash) {
                    user.password = hash;
                    let data = {
                       DES_NOMBRE: user.nombre,
                       DES_USUARIO: user.usuario,
                       DES_PASS:user.password,
                        DES_CORREO:user.email,
                        DES_APELLIDO:user.apellido
                    }
                    
                    //const save = await pool.query(consulta.insert('USUARIOS', data));
                    if(consulta.funciones.insertTable('USUARIOS', data)){
                        return res.status(200).send({
                            'message': 'Usuario registrado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al guardar el usuario',
                           
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
       
        let user =  await pool.query(consulta.list('usuarios'))
        return res.status(200).send({
            'lista': user
        })
        
    },

    login:async function(req, res){

        let params = req.body;

        //Validamos datos
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;

        let validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        let validate_pass       = !validator.isEmpty(params.password);
        let user = Usuario;
        if(validate_email && validate_pass){

            //Buscar usuario si coincide
            const verifica = await pool.query(consulta.search('USUARIOS', 'DES_CORREO', user.email, 'equals'))
            if(verifica){

                //Verificamos la contraseña
                user.email = params.email;
                user.password = params.password;
                console.log(consulta.custom(`SELECT * FROM usuarios WHERE DES_CORREO = '${user.email}'`))
                let usuario = await pool.query(consulta.custom(`SELECT * FROM usuarios WHERE DES_CORREO = '${user.email}'`));

                console.log(usuario)
                bcrypt.compare(params.password, usuario[0].DES_PASS, (err, check) => {
                    
                    if(check){
                        //generamos JWT
                        if(params.gettoken){
                            return res.status(200).send({
                               token: jwt.createToken(usuario[0]),

                            }); 
                        }

                    }else{
                        return res.status(400).send({
                            'message': 'El usuario no existe'
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
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.apellido = (params.apellido == undefined)?'':params.apellido;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.usuario  = (params.usuario == undefined)?'':params.usuario;
        try{
            let validate_nombre     = !validator.isEmpty(params.nombre);
            let validate_apellido   = !validator.isEmpty(params.apellido);
            let validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            let validate_pass       = !validator.isEmpty(params.password);
            let validate_user       = !validator.isEmpty(params.usuario);
        }catch(ex){
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }
       

        if(req.user.sub == id){ //Valido que solo el usuario pueda modificar su propio usuario
            let user =  Usuario;

            //Valido duplicidad
            if(params.email != ''){
                let email =  await pool.query(consulta.search('USUARIOS', 'DES_CORREO', params.email, 'equals'))
                if(email.length != 0){
                    return res.status(400).send({
                        'message': 'El correo ya fue tomado'
                    });
                }
            }

            //Busco el usuario a actualizar y verifico si existe
            let usuario =  await pool.query(consulta.get("usuarios", id));

            if(usuario.length == 0){
                return res.status(400).send({
                    'message': 'Usuario no existe'
                });
            }else{
                //Valido la entrada de datos
                usuario = usuario[0]
                user.nombre   = (params.nombre == '')?usuario.DES_NOMBRE:params.nombre;
                user.apellido = (params.apellido == '')?usuario.DES_APELLIDO: params.apellido;
                user.password = (params.password == '')?usuario.DES_PASS:params.password;
                user.usuario  = (params.usuario == '')?usuario.DES_USUARIO:params.usuario;
                user.rol      = null;
                user.email    = (params.email == '')?usuario.DES_CORREO:params.email;

                let data = {
                    ID: id,
                    DES_NOMBRE: user.nombre,
                    DES_APELLIDO: user.apellido,
                    DES_CORREO:user.email,
                    DES_PASS:user.password,
                    DES_USUARIO: user.usuario
                }
                //Guardo en la base de datos
                if(params.password == undefined){
                    if(consulta.funciones.update('usuarios', data)){
                        return res.status(200).send({
                            'message': 'Usuario actualizado exitosamente',
                            'user': user
                        }); 
                    }else{
                        return res.status(400).send({
                            'message': 'Error al actualizar el usuario',
                           
                        }); 
                    }
                }else{
                    bcrypt.hash(params.password, 4, function(err, hash) {
                        data.password = hash;
                        if(consulta.funciones.update('usuarios', data)){
                            return res.status(200).send({
                                'message': 'Usuario actualizado exitosamente',
                                'user': user
                            }); 
                        }else{
                            return res.status(400).send({
                                'message': 'Error al actualizar el usuario',
                               
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
            const borrar = await pool.query(consulta.remove('usuarios', req.user.sub));
            return res.status(200).send({
                'message': 'Usuario eliminado exitosamente',
                'user': req.user
            }); 
        }else{
            return res.status(400).send({
                'message': 'El usuario no tiene permiso para realizar esta acción'
            });
        }
    }

}

module.exports = usuario;