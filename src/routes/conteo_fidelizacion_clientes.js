const express = require('express');
const Conteo_fidelizacion_clientesController = require('../Controller/Conteo_fidelizacion_clientesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Conteo_fidelizacion_clientess
router.post('/conteo-clientes/registro/:ID_FIDELIZACION_CLIENTE/:ID_REGISTRO_FIDELIZACION_CLIENTE',      md_auth.authenticated, Conteo_fidelizacion_clientesController.crear);
router.get('/conteo-clientes/mostrar/:page?/:limit?',        md_auth.authenticated, Conteo_fidelizacion_clientesController.mostrar);
router.put('/conteo-clientes/actualizar/:ID_FIDELIZACION_CLIENTE/:ID_REGISTRO_FIDELIZACION_CLIENTE', md_auth.authenticated, Conteo_fidelizacion_clientesController.update);
router.delete('/conteo-clientes/eliminar/:ID_FIDELIZACION_CLIENTE/:ID_REGISTRO_FIDELIZACION_CLIENTE',md_auth.authenticated, Conteo_fidelizacion_clientesController.delete);
router.post('/conteo-clientes/listar/:page?/:limit?',     Conteo_fidelizacion_clientesController.listar);

//Meta Conteo_fidelizacion_clientess
module.exports = router;