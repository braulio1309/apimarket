const express = require('express');
const MetapedidosController = require('../Controller/MetaPedidosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//metapedidoss
router.post('/metapedidos/registro',      md_auth.authenticated, MetapedidosController.crear);
router.get('/metapedidos/mostrar/:page?/:limit?',        md_auth.authenticated, MetapedidosController.mostrar);
router.put('/metapedidos/actualizar/:id', md_auth.authenticated, MetapedidosController.update);
router.delete('/metapedidos/eliminar/:id',md_auth.authenticated, MetapedidosController.delete);
router.post('/metapedidos/listar/:page?/:limit?',     MetapedidosController.listar);

//Meta metapedidoss
module.exports = router;