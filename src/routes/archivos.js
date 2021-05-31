const express = require('express');
const ArchivosController = require('../Controller/ArchivosController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Archivoss
router.get('/archivos/registro',      md_auth.authenticated, ArchivosController.subir);
/*router.put('/archivos/detalle/:id', md_auth.authenticated, ArchivosController.detalle);
router.delete('/archivos/eliminar/:id',md_auth.authenticated, ArchivosController.delete);*/

//Meta Archivoss
module.exports = router;