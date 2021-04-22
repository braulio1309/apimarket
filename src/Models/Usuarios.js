const pool = require('../../database')

var Usuario = {
    nombre: '', 
    apellido : '', 
    usuario: '', 
    email: '',
    password: '',
    rol: null,
    fecha: '',
    estatus: null,

    findOne:async function(){
      //Si retorna true consigue a alguien
      var verifica = await pool.query('SELECT * FROM usuarios WHERE DES_CORREO = ?', this.email);
      var flag = verifica.length > 0 ? true : false;
      
      return flag;
    },

    encontrarUsuario:async function(req, res){

      var user = await pool.query('SELECT * FROM usuarios WHERE DES_CORREO = ?', this.email);
      return user[0];
    },

    save:async function(req, res){
      var date = new Date();
      
      return await pool.query("INSERT INTO usuarios (DES_NOMBRE, DES_APELLIDO, DES_USUARIO, DES_CORREO, DES_PASS, JSON_ROL, FECHA, ESTATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        this.nombre, this.apellido, this.usuario, this.email, this.password, this.rol, date, this.estatus
      ]);
    },

    list:async function(req, res){

        return await pool.query('SELECT * FROM usuarios')

    },

    update:function(req, res){

    }

};

module.exports = Usuario;
