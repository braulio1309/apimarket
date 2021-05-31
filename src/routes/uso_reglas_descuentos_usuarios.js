const express = require('express');
const UsoDescuentosController = require('../Controller/Uso_reglas_descuentos_usuariosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//UsoDescuentoss
router.post('/uso-descuentos/registro',      md_auth.authenticated, UsoDescuentosController.crear);
router.get('/uso-descuentos/mostrar/:page?/:limit?',        md_auth.authenticated, UsoDescuentosController.mostrar);
router.put('/uso-descuentos/actualizar/:id', md_auth.authenticated, UsoDescuentosController.update);
router.delete('/uso-descuentos/eliminar/:id',md_auth.authenticated, UsoDescuentosController.delete);

//Meta UsoDescuentoss
module.exports = router;