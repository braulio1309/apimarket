var express = require('express');
var UsuarioController = require('../Controller/UsuarioController');

var router = express.Router();

//Usuarios
router.post('/registro',    UsuarioController.crear);
router.post('/login',       UsuarioController.login);
router.get('/mostrar',     UsuarioController.mostrar);
router.post('/actualizar',  UsuarioController.update);

//Meta Usuarios
module.exports = router;