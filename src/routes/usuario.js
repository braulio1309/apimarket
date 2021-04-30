const express = require('express');
const UsuarioController = require('../Controller/UsuarioController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Usuarios
router.post('/registro',    UsuarioController.crear);
router.post('/login',       UsuarioController.login);
router.get('/mostrar',     UsuarioController.mostrar);
router.put('/actualizar/:id', md_auth.authenticated,  UsuarioController.update);
router.delete('/eliminar/:id', md_auth.authenticated,  UsuarioController.delete);

//Meta Usuarios
module.exports = router;