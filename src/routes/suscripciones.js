const express = require('express');
const SuscripcionesController = require('../Controller/SuscripcionesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Suscripcioness
router.post('/suscripciones/registro',      md_auth.authenticated, SuscripcionesController.crear);
router.get('/suscripciones/mostrar',        md_auth.authenticated, SuscripcionesController.mostrar);
/*router.put('/suscripciones/actualizar/:id', md_auth.authenticated, SuscripcionesController.update);
router.delete('/suscripciones/eliminar/:id',md_auth.authenticated, SuscripcionesController.delete);*/

//Meta Suscripcioness
module.exports = router;