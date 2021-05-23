const express = require('express');
const MetaVariablesController = require('../Controller/MetaVariablesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//MetaVariabless
router.post('/metavariables/registro',      md_auth.authenticated, MetaVariablesController.crear);
router.get('/metavariables/mostrar',        md_auth.authenticated, MetaVariablesController.mostrar);
router.put('/metavariables/actualizar/:id', md_auth.authenticated, MetaVariablesController.update);
router.delete('/metavariables/eliminar/:id',md_auth.authenticated, MetaVariablesController.delete);

//Meta MetaVariabless
module.exports = router;