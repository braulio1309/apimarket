const express = require('express');
const CuponesController = require('../Controller/CuponesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Cuponess
router.post('/cupones/registro',      md_auth.authenticated, CuponesController.crear);
router.get('/cupones/mostrar/:page?/:limit?',        md_auth.authenticated, CuponesController.mostrar);
router.put('/cupones/actualizar/:id', md_auth.authenticated, CuponesController.update);
router.delete('/cupones/eliminar/:id',md_auth.authenticated, CuponesController.delete);
router.post('/cupones/listar/:page?/:limit?',     CuponesController.listar);

//Meta Cuponess
module.exports = router;