const express = require('express');
const MetaproductosController = require('../Controller/MetaProductosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//metaproductoss
router.post('/metaproductos/registro',      md_auth.authenticated, MetaproductosController.crear);
router.get('/metaproductos/mostrar/:page?/:limit?',        md_auth.authenticated, MetaproductosController.mostrar);
router.put('/metaproductos/actualizar/:id', md_auth.authenticated, MetaproductosController.update);
router.delete('/metaproductos/eliminar/:id',md_auth.authenticated, MetaproductosController.delete);

//Meta metaproductoss
module.exports = router;