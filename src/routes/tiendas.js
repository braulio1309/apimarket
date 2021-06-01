const express = require('express');
const TiendasController = require('../Controller/TiendasController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Tiendass
router.post('/tiendas/registro',      md_auth.authenticated, TiendasController.crear);
router.get('/tiendas/mostrar/:page?/:limit?',        md_auth.authenticated, TiendasController.mostrar);
router.put('/tiendas/actualizar/:id', md_auth.authenticated, TiendasController.update);
router.delete('/tiendas/eliminar/:id',md_auth.authenticated, TiendasController.delete);
router.post('/tiendas/listar/:page?/:limit?',     TiendasController.listar);

//Meta Tiendass
module.exports = router;