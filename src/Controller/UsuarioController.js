var validator = require('validator');
var Usuario = require('../Models/Usuarios');
var bcrypt = require('bcryptjs');
var jwt = require('../services/jwt');
var moment = require('moment');
const pool = require('../../database')


var usuario = {

    crear:async function(req, res) {

        var params = req.body;
        //Validar datos
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.apellido = (params.apellido == undefined)?'':params.apellido;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.usuario  = (params.usuario == undefined)?'':params.usuario;

        var validate_nombre     = !validator.isEmpty(params.nombre);
        var validate_apellido   = !validator.isEmpty(params.apellido);
        var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_pass       = !validator.isEmpty(params.password);
        var validate_user       = !validator.isEmpty(params.usuario);

        if(validate_nombre && validate_pass && validate_email){
            //Verificamos si existe
            var user =  Usuario;

            user.nombre = params.nombre;
            user.apellido = params.apellido;
            user.password = params.password;
            user.usuario  = params.usuario;
            user.rol = null;
            user.email = params.email;

            
            //Si da true el usuario existe
            var verifica = user.findOne();
            var verifica =  await pool.query("SELECT * FROM usuarios WHERE DES_CORREO = ?", [user.email]);
           
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'Usuario ya existe'
                });
            }else{
                //Guardo en la base de datos
                bcrypt.hash(params.password, 4, function(err, hash) {
                    user.password = hash;
                    
                    if(user.save()){
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
       
        var user =  await pool.query("SELECT * FROM usuarios");

        return res.status(200).send({
            'lista': user
        })
        
    },

    login:async function(req, res){

        var params = req.body;

        //Validamos datos
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;

        var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_pass       = !validator.isEmpty(params.password);
        var user = Usuario;
        if(validate_email && validate_pass){

            //Buscar usuario si coincide
            var verifica =  await pool.query("SELECT * FROM usuarios WHERE DES_CORREO = ?", [user.email]);
            if(verifica){

                //Verificamos la contraseña
                user.email = params.email;
                user.password = params.password;
                var usuario = await pool.query('SELECT * FROM usuarios WHERE DES_CORREO = ? LIMIT 1', [user.email]);
                //var usuario = user.encontrarUsuario();
                
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
        var params = req.body;

        //Validar datos
        var id = req.params.id //ID por parametros
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.apellido = (params.apellido == undefined)?'':params.apellido;
        params.email    = (params.email == undefined)?'':params.email;
        params.password = (params.password == undefined)?'':params.password;
        params.usuario  = (params.usuario == undefined)?'':params.usuario;
        try{
            var validate_nombre     = !validator.isEmpty(params.nombre);
            var validate_apellido   = !validator.isEmpty(params.apellido);
            var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_pass       = !validator.isEmpty(params.password);
            var validate_user       = !validator.isEmpty(params.usuario);
        }catch(ex){
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }
       

        if(req.user.sub == id){ //Valido que solo el usuario pueda modificar su propio usuario
            var user =  Usuario;

            //Valido duplicidad
            if(params.email != ''){
                var email =  await pool.query("SELECT * FROM usuarios WHERE DES_CORREO = ?", [params.email]);
                if(email.length != 0){
                    return res.status(400).send({
                        'message': 'El correo ya fue tomado'
                    });
                }
            }

            //Busco el usuario a actualizar y verifico si existe
            var usuario =  await pool.query("SELECT * FROM usuarios WHERE ID = ?", [id]);
            console.log(params.nombre)

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

                //Guardo en la base de datos
                if(params.password == undefined){
                    if(user.update(id)){
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
                        user.password = hash;
                        if(user.update(id)){
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

    }

}

module.exports = usuario;