const express = require('express');
const CategoriasProductosController = require('../Controller/CategoriasProductosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//categoriasproductoss
router.post('/categoriasproductos/registro',      md_auth.authenticated, CategoriasProductosController.crear);
router.get('/categoriasproductos/mostrar/:page?/:limit?',        md_auth.authenticated, CategoriasProductosController.mostrar);
router.put('/categoriasproductos/actualizar/:id', md_auth.authenticated, CategoriasProductosController.update);
router.delete('/categoriasproductos/eliminar/:id',md_auth.authenticated, CategoriasProductosController.delete);

//Meta categoriasproductoss
module.exports = router;