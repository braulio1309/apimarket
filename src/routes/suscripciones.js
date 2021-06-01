const express = require('express');
const SuscripcionesController = require('../Controller/SuscripcionesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Suscripcioness
router.post('/suscripciones/registro',      md_auth.authenticated, SuscripcionesController.crear);
router.get('/suscripciones/mostrar/:page?/:limit?',        md_auth.authenticated, SuscripcionesController.mostrar);
router.put('/suscripciones/actualizar/:ID_PEDIDO/:ID_PRODUCTO/:ID_USUARIO', md_auth.authenticated, SuscripcionesController.update);
router.delete('/suscripciones/eliminar/:ID_PEDIDO/:ID_PRODUCTO/:ID_USUARIO',md_auth.authenticated, SuscripcionesController.delete);
router.post('/suscripciones/listar/:page?/:limit?',     SuscripcionesController.listar);

//Meta Suscripcioness
module.exports = router;