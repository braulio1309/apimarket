const express = require('express');
const PedidosController = require('../Controller/PedidosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Pedidoss
router.post('/pedidos/registro/:id',      md_auth.authenticated, PedidosController.crear);
router.get('/pedidos/mostrar/:page?/:limit?',        md_auth.authenticated, PedidosController.mostrar);
router.put('/pedidos/actualizar/:id', md_auth.authenticated, PedidosController.update);
router.delete('/pedidos/eliminar/:id',md_auth.authenticated, PedidosController.delete);
router.post('/pedidos/listar/:page?/:limit?',     PedidosController.listar);

//Meta Pedidoss
module.exports = router;