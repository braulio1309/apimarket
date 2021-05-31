const express = require('express');
const Reglas_descuentoController = require('../Controller/ReglasDescuentoController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Reglas_descuentos
router.post('/reglas-descuento/registro/:idtienda',      md_auth.authenticated, Reglas_descuentoController.crear);
router.get('/reglas-descuento/mostrar/:page?/:limit?',        md_auth.authenticated, Reglas_descuentoController.mostrar);
router.put('/reglas-descuento/actualizar/:id', md_auth.authenticated, Reglas_descuentoController.update);
router.delete('/reglas-descuento/eliminar/:id',md_auth.authenticated, Reglas_descuentoController.delete);

//Meta Reglas_descuentos
module.exports = router;