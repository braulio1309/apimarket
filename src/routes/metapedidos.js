const express = require('express');
const MetapedidosController = require('../Controller/MetaPedidosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//metapedidoss
router.post('/metapedidos/registro',      md_auth.authenticated, MetapedidosController.crear);
router.get('/metapedidos/mostrar',        md_auth.authenticated, MetapedidosController.mostrar);
router.put('/metapedidos/actualizar/:id', md_auth.authenticated, MetapedidosController.update);
router.delete('/metapedidos/eliminar/:id',md_auth.authenticated, MetapedidosController.delete);

//Meta metapedidoss
module.exports = router;