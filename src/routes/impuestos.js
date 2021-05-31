const express = require('express');
const ImpuestosController = require('../Controller/ImpuestosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Impuestoss
router.post('/impuestos/registro',      md_auth.authenticated, ImpuestosController.crear);
router.get('/impuestos/mostrar/:page?/:limit?',        md_auth.authenticated, ImpuestosController.mostrar);
router.put('/impuestos/actualizar/:id', md_auth.authenticated, ImpuestosController.update);
router.delete('/impuestos/eliminar/:id',md_auth.authenticated, ImpuestosController.delete);

//Meta Impuestoss
module.exports = router;