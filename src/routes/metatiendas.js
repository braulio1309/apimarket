const express = require('express');
const MetatiendaController = require('../Controller/MetatiendaController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();

//Metatiendas
router.post('/metatienda/registro',      md_auth.authenticated, MetatiendaController.crear);
router.get('/metatienda/mostrar',        md_auth.authenticated, MetatiendaController.mostrar);
router.put('/metatienda/actualizar/:id', md_auth.authenticated, MetatiendaController.update);
router.delete('/metatienda/eliminar/:id',md_auth.authenticated, MetatiendaController.delete);

//Meta Metatiendas
module.exports = router;