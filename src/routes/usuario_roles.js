const express = require('express');
const Usuarios_rolesController = require('../Controller/Usuarios_rolesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Usuario_roless
router.post('/usuariosroles/registro',      md_auth.authenticated, Usuarios_rolesController.crear);
router.get('/usuariosroles/mostrar/:page?/:limit?',        md_auth.authenticated, Usuarios_rolesController.mostrar);
router.put('/usuariosroles/actualizar/:id_usuario/:id_rol', md_auth.authenticated, Usuarios_rolesController.update);
router.delete('/usuariosroles/eliminar/:id_usuario/:id_rol',md_auth.authenticated, Usuarios_rolesController.delete);

//Meta Usuario_roless
module.exports = router;