var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user){
    
    var payload = {
        sub: user.ID,
        nombre: user.DES_NOMBRE,
        apellido: user.DES_APELLIDO,
        email: user.DES_CORREO,
        rol: user.JSON_ROL,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix,

    };

    return jwt.encode(payload, 'clave-secreta-1309');
}