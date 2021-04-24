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
      
      var verifica =  await pool.query('SELECT * FROM usuarios WHERE DES_CORREO = ? LIMIT 1', [this.email]);
      var flag = verifica.length == 0;
      return flag;
    },

    encontrarUsuario:async function(req, res){

     
      return await pool.query('SELECT * FROM usuarios WHERE DES_CORREO = ? LIMIT 1', this.email);;
    },

    save:async function(req, res){
      var date = new Date();
      this.fecha = date;
      return await pool.query("INSERT INTO usuarios (DES_NOMBRE, DES_APELLIDO, DES_USUARIO, DES_CORREO, DES_PASS, JSON_ROL, FECHA, ESTATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        this.nombre, this.apellido, this.usuario, this.email, this.password, this.rol, date, this.estatus
      ]);
    },

    list:async function(req, res){

        return await pool.query('SELECT * FROM usuarios')

    },

    update: async function(id){
      
      console.log(id)
      var date = new Date();
      this.fecha = date;
      return await pool.query('UPDATE usuarios SET DES_NOMBRE = ?, DES_APELLIDO = ?, DES_USUARIO = ?, DES_CORREO = ?, DES_PASS = ?, JSON_ROL = ?, FECHA = ?, ESTATUS = ? WHERE ID = ?', [
        this.nombre, this.apellido, this.usuario, this.email, this.password, this.rol, date, this.estatus, id
      ]);
    }

};

module.exports = Usuario;
