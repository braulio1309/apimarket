const express = require('express');
const MetaUsuariosController = require('../Controller/MetaUsuariosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//MetaUsuarioss
router.post('/metausuarios/registro',      md_auth.authenticated, MetaUsuariosController.crear);
router.get('/metausuarios/mostrar/:page?/:limit?',        md_auth.authenticated, MetaUsuariosController.mostrar);
router.put('/metausuarios/actualizar/:id', md_auth.authenticated, MetaUsuariosController.update);
router.delete('/metausuarios/eliminar/:id',md_auth.authenticated, MetaUsuariosController.delete);

//Meta MetaUsuarioss
module.exports = router;