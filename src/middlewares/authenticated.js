var jwt = require('jwt-simple');
var moment = require('moment')
var secret = "clave-secreta-1309";

exports.authenticated = function(req, res, next){
    
    //Comprobar si llega autorización
    if(!req.headers.authorization){
        return res.status(403).send({
            mensaje: "Usuario no identificado"
        });
    }
    //Decodificar el token
    var payload;
    try{
        console.log('d')

        payload = jwt.decode(req.headers.authorization, secret);
        //Comprobar si el token expiró
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                mensaje: 'El token ha expirado'
            })
        }
    }catch(ex){
        return res.status(404).send({
            mensaje: 'El token no es válido'
        })
    }
    //Identificar usuario
    req.user = payload;
    next();
}