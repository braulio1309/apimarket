var express = require('express');
var UsuarioController = require('../Controller/UsuarioController');
var md_auth = require('../middlewares/authenticated');
var router = express.Router();

//Usuarios
router.post('/registro',    UsuarioController.crear);
router.post('/login',       UsuarioController.login);
router.get('/mostrar',     UsuarioController.mostrar);
router.put('/actualizar/:id', md_auth.authenticated,  UsuarioController.update);

//Meta Usuarios
module.exports = router;