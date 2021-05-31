const express = require('express');
const ProductosController = require('../Controller/ProductosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Productoss
router.post('/productos/registro/:idtienda',      md_auth.authenticated, ProductosController.crear);
router.get('/productos/mostrar/:page?/:limit?',        md_auth.authenticated, ProductosController.mostrar);
router.put('/productos/actualizar/:id', md_auth.authenticated, ProductosController.update);
router.delete('/productos/eliminar/:id',md_auth.authenticated, ProductosController.delete);

//Meta Productoss
module.exports = router;