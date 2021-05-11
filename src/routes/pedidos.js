const express = require('express');
const PedidosController = require('../Controller/PedidosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Pedidoss
router.post('/pedidos/registro',      md_auth.authenticated, PedidosController.crear);
router.get('/pedidos/mostrar',        md_auth.authenticated, PedidosController.mostrar);
router.put('/pedidos/actualizar/:id', md_auth.authenticated, PedidosController.update);
router.delete('/pedidos/eliminar/:id',md_auth.authenticated, PedidosController.delete);

//Meta Pedidoss
module.exports = router;