//Librerías y servicios
const validator = require('validator');
const USUARIOS_ROLES = require('../Models/Usuarios_roles');
const USUARIOS = require('../Models/User');
const ROLES = require('../Models/Roles');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const usuarios_roles = {
    crear:async function(req, res) {

        let params = req.body;

         //Validar datos
         params.usuario   = (params.usuario == undefined)?'':params.usuario;
         params.rol   = (params.rol == undefined)?'':params.rol;
 
         let validate_usuario   = !validator.isEmpty(params.usuario);
         let validate_rol  = !validator.isEmpty(params.rol);

         if(validate_usuario && validate_rol){

            //validamos que exista el usuario
            const user = await pool.query(consulta.get(USUARIOS.TABLA, params.usuario));
            if(user.length == 0){
                return res.status(400).send({
                    'message': 'Usuario inexistente'
                });
            }

            //Validamos que exista el rol
            const rol = await pool.query(consulta.get(ROLES.TABLA, params.rol));
            if(rol.length == 0){
                return res.status(400).send({
                    'message': 'Rol inexistente'
                });
            }
            
            //validamos que no se repita el registro
            const user_rol = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${params.usuario}
            AND ${USUARIOS_ROLES.ID_ROL} = ${params.rol}`))

            if(user_rol.length == 0){

                //Guardamos en la base de datos
                const data = {
                    ID_USUARIO: params.usuario,
                    ID_ROL: params.rol,
                    ID_USUARIO_ALTA: req.user.sub,
                    FECHA: date,
                    ESTATUS: 1
                }

                const save = consulta.funciones.insertTable(USUARIOS_ROLES.TABLA, data)
                return res.status(200).send({
                    'message': 'Usuario y rol registrados exitosamente',
                    'data': data
                }); 
            }else{
                return res.status(400).send({
                    'message': 'Ya este registro se encuentra en la base de datos'
                });
            }
         }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
         }
    },

    mostrar: async function(req, res){
        const lista = await pool.query(consulta.list(USUARIOS_ROLES.TABLA));
        return res.status(200).send({
            'lista': lista
        })
    },

    update:async function(req, res){
        let params = req.body;

         //Validar datos
         const id_usuario = req.params.id_usuario
         const id_rol = req.params.id_rol

         params.usuario   = (params.usuario == undefined)?'':params.usuario;
         params.rol   = (params.rol == undefined)?'':params.rol;
         params.estatus   = (params.estatus == undefined)?'':params.estatus;

         let validate_usuario   = !validator.isEmpty(params.usuario);
         let validate_rol  = !validator.isEmpty(params.rol);
         let validate_estatus  = !validator.isEmpty(params.estatus);

         if(validate_usuario && validate_rol && validate_estatus){

            //Validamos que este el registro a actualizar
            let roles_user = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${id_usuario}
            AND ${USUARIOS_ROLES.ID_ROL} = ${id_rol}`))      

          if(roles_user.length == 0){
                return res.status(400).send({
                    'message': 'El registro no existe'
                });
            }
            //validamos que exista el usuario
            const user = await pool.query(consulta.get(USUARIOS.TABLA, params.usuario));
            if(user.length == 0){
                return res.status(400).send({
                    'message': 'Usuario inexistente'
                });
            }

            //Validamos que exista el rol
            const rol = await pool.query(consulta.get(ROLES.TABLA, params.rol));
            if(rol.length == 0){
                return res.status(400).send({
                    'message': 'Rol inexistente'
                });
            }
            
            //validamos que no se repita el registro
            const user_rol = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${params.usuario}
            AND ${USUARIOS_ROLES.ID_ROL} = ${params.rol} AND ${USUARIOS_ROLES.ESTATUS} = ${params.estatus}`  ))

            if(user_rol.length == 0){

                //Guardamos en la base de datos
                roles_user = roles_user[0]
                const data = {
                    ID_USUARIO: (params.usuario == '')?roles_user.ID_USUARIO:params.usuario,
                    ID_ROL:  (params.rol == '')?roles_user.ID_ROL:params.rol,
                    ID_USUARIO_ALTA: req.user.sub,
                    FECHA: roles_user.FECHA,
                    ESTATUS:  (params.estatus == '')?roles_user.ESTATUS:params.estatus
                }

                
                await pool.query(consulta.custom(`UPDATE ${USUARIOS_ROLES.TABLA} SET ${USUARIOS_ROLES.ID_USUARIO} = ${data.ID_USUARIO}, 
                    ${USUARIOS_ROLES.ID_ROL} = ${data.ID_ROL}, ${USUARIOS_ROLES.ESTATUS} = ${data.ESTATUS} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${id_usuario}
                    AND ${USUARIOS_ROLES.ID_ROL} = ${id_rol} `));

                return res.status(200).send({
                    'message': 'Usuario y rol actualizados exitosamente',
                    'data': data
                }); 
            }else{
                return res.status(400).send({
                    'message': 'Ya este registro se encuentra en la base de datos'
                });
            }
         }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
         }
    },

    delete: async function (req, res){

        let id_usuario = req.params.id_usuario;
        let id_rol = req.params.id_rol
        console.log(consulta.custom(`DELETE FROM ${USUARIOS_ROLES.TABLA} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${id_usuario}
        AND ${USUARIOS_ROLES.ID_ROL} = ${id_rol}`))
        const borrar = await pool.query(consulta.custom(`DELETE FROM ${USUARIOS_ROLES.TABLA} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${id_usuario}
        AND ${USUARIOS_ROLES.ID_ROL} = ${id_rol}`));

        return res.status(200).send({
            'message': 'Se le eliminó el rol al usuario exitosamente',
        }); 
    }
}

module.exports = usuarios_roles;