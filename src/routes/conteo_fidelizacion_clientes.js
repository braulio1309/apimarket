const express = require('express');
const Conteo_fidelizacion_clientesController = require('../Controller/Conteo_fidelizacion_clientesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Conteo_fidelizacion_clientess
router.post('/cupones/registro',      md_auth.authenticated, Conteo_fidelizacion_clientesController.crear);
router.get('/cupones/mostrar/:page?/:limit?',        md_auth.authenticated, Conteo_fidelizacion_clientesController.mostrar);
router.put('/cupones/actualizar/:ID_FIDELIZACION_CLIENTE/:ID_REGISTRO_FIDELIZACION_CLIENTE', md_auth.authenticated, Conteo_fidelizacion_clientesController.update);
router.delete('/cupones/eliminar/:id',md_auth.authenticated, Conteo_fidelizacion_clientesController.delete);

//Meta Conteo_fidelizacion_clientess
module.exports = router;