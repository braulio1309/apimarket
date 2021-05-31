const express = require('express');
const MetaRolesController = require('../Controller/MetaRolesController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//metaroless
router.post('/metaroles/registro',      md_auth.authenticated, MetaRolesController.crear);
router.get('/metaroles/mostrar/:page?/:limit?',        md_auth.authenticated, MetaRolesController.mostrar);
router.put('/metaroles/actualizar/:id', md_auth.authenticated, MetaRolesController.update);
router.delete('/metaroles/eliminar/:id',md_auth.authenticated, MetaRolesController.delete);

//Meta metaroless
module.exports = router;