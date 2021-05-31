const express = require('express');
const ZonasController = require('../Controller/Zonas_enviosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//zonass
router.post('/zonas/registro',      md_auth.authenticated, ZonasController.crear);
router.get('/zonas/mostrar/:page?/:limit?',        md_auth.authenticated, ZonasController.mostrar);
router.put('/zonas/actualizar/:id', md_auth.authenticated, ZonasController.update);
router.delete('/zonas/eliminar/:id',md_auth.authenticated, ZonasController.delete);

//Meta zonass
module.exports = router;