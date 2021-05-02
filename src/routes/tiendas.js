const express = require('express');
const TiendasController = require('../Controller/TiendasController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Tiendass
router.post('/tiendas/registro',      md_auth.authenticated, TiendasController.crear);
router.get('/tiendas/mostrar',        md_auth.authenticated, TiendasController.mostrar);
router.put('/tiendas/actualizar/:id', md_auth.authenticated, TiendasController.update);
router.delete('/tiendas/eliminar/:id',md_auth.authenticated, TiendasController.delete);

//Meta Tiendass
module.exports = router;