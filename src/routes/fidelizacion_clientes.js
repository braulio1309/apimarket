const express = require('express');
const FidelizacionClientesController = require('../Controller/Fidelizacion_clientesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//FidelizacionClientess
router.post('/fidelizacion/registro',      md_auth.authenticated, FidelizacionClientesController.crear);
router.get('/fidelizacion/mostrar/:page?/:limit?',        md_auth.authenticated, FidelizacionClientesController.mostrar);
router.put('/fidelizacion/actualizar/:id', md_auth.authenticated, FidelizacionClientesController.update);
router.delete('/fidelizacion/eliminar/:id',md_auth.authenticated, FidelizacionClientesController.delete);
router.post('/fidelizacion/listar/:page?/:limit?',     FidelizacionClientesController.listar);

//Meta FidelizacionClientess
module.exports = router;