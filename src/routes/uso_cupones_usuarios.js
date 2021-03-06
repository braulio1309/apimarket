const express = require('express');
const UsoCuponesController = require('../Controller/UsoCuponesUsuariosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//UsoCuponess
router.post('/uso-cupones/registro',      md_auth.authenticated, UsoCuponesController.crear);
router.get('/uso-cupones/mostrar/:page?/:limit?',        md_auth.authenticated, UsoCuponesController.mostrar);
router.put('/uso-cupones/actualizar/:id', md_auth.authenticated, UsoCuponesController.update);
router.delete('/uso-cupones/eliminar/:id',md_auth.authenticated, UsoCuponesController.delete);
router.post('/uso-cupones/listar/:page?/:limit?',     UsoCuponesController.listar);

//Meta UsoCuponess
module.exports = router;