const express = require('express');
const MetaPedidosproductosController = require('../Controller/MetaPedidosproductosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//metaPedidosproductoss
router.post('/metapedidosproductos/registro',      md_auth.authenticated, MetaPedidosproductosController.crear);
router.get('/metapedidosproductos/mostrar',        md_auth.authenticated, MetaPedidosproductosController.mostrar);
router.put('/metapedidosproductos/actualizar/:id', md_auth.authenticated, MetaPedidosproductosController.update);
router.delete('/metapedidosproductos/eliminar/:id',md_auth.authenticated, MetaPedidosproductosController.delete);

//Meta metaPedidosproductoss
module.exports = router;