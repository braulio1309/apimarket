const express = require('express');
const UsuarioController = require('../Controller/UsuarioController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Usuarios
router.post('/user/registro',    UsuarioController.crear);
router.post('/login',       UsuarioController.login);
router.get('/user/mostrar',     UsuarioController.mostrar);
router.put('/user/actualizar/:id', md_auth.authenticated,  UsuarioController.update);
router.delete('/user/eliminar/:id', md_auth.authenticated,  UsuarioController.delete);

//Meta Usuarios
module.exports = router;