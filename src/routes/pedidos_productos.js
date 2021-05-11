const express = require('express');
const PedidosproductosController = require('../Controller/PedidosproductosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Pedidosproductoss
router.post('/pedidosproductos/registro/:idtienda/:idpedido',      md_auth.authenticated, PedidosproductosController.crear);
router.get('/pedidosproductos/mostrar',        md_auth.authenticated, PedidosproductosController.mostrar);
router.put('/pedidosproductos/actualizar/:id', md_auth.authenticated, PedidosproductosController.update);
router.delete('/pedidosproductos/eliminar/:id',md_auth.authenticated, PedidosproductosController.delete);

//Meta Pedidosproductoss
module.exports = router;