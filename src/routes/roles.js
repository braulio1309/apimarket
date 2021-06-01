const express = require('express');
const RolesController = require('../Controller/RolesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Roless
router.post('/roles/registro',      md_auth.authenticated, RolesController.crear);
router.get('/roles/mostrar/:page?/:limit?',        md_auth.authenticated, RolesController.mostrar);
router.put('/roles/actualizar/:id', md_auth.authenticated, RolesController.update);
router.delete('/roles/eliminar/:id',md_auth.authenticated, RolesController.delete);
router.post('/roles/listar/:page?/:limit?',     RolesController.listar);

//Meta Roless
module.exports = router;