const express = require('express');
const UsuarioController = require('../Controller/UsuarioController');
const md_auth = require('../middlewares/authenticated');
const router = express.Router();
const passport = require('passport')
const strategy = require('passport-facebook')

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Usuarios
router.post('/user/registro',    UsuarioController.crear);
router.post('/login',       UsuarioController.login);
router.get('/user/mostrar/:page?/:limit?',     UsuarioController.mostrar);
router.put('/user/actualizar/:id', md_auth.authenticated,  UsuarioController.update);
router.delete('/user/eliminar/:id', md_auth.authenticated,  UsuarioController.delete);
router.post('/user/listar/:page?/:limit?',     UsuarioController.listar);


router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/fail"
    })
);
  
router.get("/fail", (req, res) => {
res.send("Failed attempt");
});

router.get("/", (req, res) => {
res.send("Success");
});


//Meta Usuarios
module.exports = router;