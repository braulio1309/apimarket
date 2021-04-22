var validator = require('validator');
var Usuario = require('../Models/Usuarios');
var bcrypt = require('bcryptjs');
var jwt = require('../services/jwt');
var moment = require('moment');

var usuario = {

    crear:async function(req, res) {

        var params = req.body;
        //Validar datos
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
            if(verifica){
                return res.status(400).send({
                    'message': 'Usuario ya existe'
                });
            }else{
                //Guardo en la base de datos
                
                
                
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

            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }
    },

    mostrar: function(req, res){
        var user = Usuario;
        var date= new Date()
        console.log(date);
        return res.status(200).send({
            'lista': user.list()
        })
        
    },

    login:function(req, res){

        var params = req.body;

        //Validamos datos
        var validate_email      = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_pass       = !validator.isEmpty(params.password);
        var user = new Usuario();
        if(validate_email && validate_pass){

            //Buscar usuario si coincide
            var verifica = user.findOne();
            if(verifica){

                //Verificamos la contraseña
                user.email = params.email;
                user.password = params.password;
                var usuario = user.encontrarUsuario();

                bcrypt.compare(params.password, usuario.password, (err, check) => {
                    
                    if(check){
                        //generamos JWT
                        if(params.gettoken){
                            return res.status(200).send({
                               token: jwt.createToken(usuario),

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

    update:function(req, res){

    }

}

module.exports = usuario;