//Librerías y servicios
const validator = require('validator');
const USUARIOS_ROLES = require('../Models/Usuarios_RoLes');
const USUARIOS = require('../Models/User');
const ROLES = require('../Models/Roles');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const ID_USUARIOs_ID_ROLes = {
    crear:async function(req, res) {

        let params = req.body;

         //Validar datos
         params.ID_USUARIO   = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
         params.ID_ROL   = (params.ID_ROL == undefined)?'':params.ID_ROL;
 
         let validate_ID_USUARIO   = !validator.isEmpty(params.ID_USUARIO);
         let validate_ID_ROL  = !validator.isEmpty(params.ID_ROL);

         if(validate_ID_USUARIO && validate_ID_ROL){

            //validamos que exista el ID_USUARIO
            const user = await pool.query(consulta.get(USUARIOS.TABLA, params.ID_USUARIO));
            if(user.length == 0){
                return res.status(400).send({
                    'message': 'Usuario inexistente'
                });
            }

            //Validamos que exista el ID_ROL
            const ID_ROL = await pool.query(consulta.get(ROLES.TABLA, params.ID_ROL));
            if(ID_ROL.length == 0){
                return res.status(400).send({
                    'message': 'Rol inexistente'
                });
            }
            
            //validamos que no se repita el registro
            const user_ID_ROL = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${params.ID_USUARIO}
            AND ${USUARIOS_ROLES.ID_ROL} = ${params.ID_ROL}`))

            if(user_ID_ROL.length == 0){

                //Guardamos en la base de datos
                const data = {
                    ID_USUARIO: params.ID_USUARIO,
                    ID_ROL: params.ID_ROL,
                    ID_USUARIO_ALTA: req.user.sub,
                    FECHA: date,
                    ESTATUS: 1
                }

                const save = consulta.funciones.insertTable(USUARIOS_ROLES.TABLA, data)
                return res.status(200).send({
                    'message': 'Usuario y ID_ROL registrados exitosamente',
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
        //let user =  await pool.query(consulta.list('DES_USUARIOs'))
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM usuarios_roles', null)
        

        return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('usuarios_roles', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){
        let params = req.body;

         //Validar datos
         const ID_USUARIO = req.params.ID_USUARIO
         const ID_ROL = req.params.ID_ROL

         params.ID_USUARIO   = (params.ID_USUARIO == undefined)?'':params.ID_USUARIO;
         params.ID_ROL   = (params.ID_ROL == undefined)?'':params.ID_ROL;
         params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

         let validate_ID_USUARIO   = !validator.isEmpty(params.ID_USUARIO);
         let validate_ID_ROL  = !validator.isEmpty(params.ID_ROL);
         let validate_ESTATUS  = !validator.isEmpty(params.ESTATUS);

         if(validate_ID_USUARIO && validate_ID_ROL && validate_ESTATUS){

            //Validamos que este el registro a actualizar
            let ID_ROLes_user = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${ID_USUARIO}
            AND ${USUARIOS_ROLES.ID_ROL} = ${ID_ROL}`))      

          if(ID_ROLes_user.length == 0){
                return res.status(400).send({
                    'message': 'El registro no existe'
                });
            }
            //validamos que exista el ID_USUARIO
            const user = await pool.query(consulta.get(USUARIOS.TABLA, params.ID_USUARIO));
            if(user.length == 0){
                return res.status(400).send({
                    'message': 'Usuario inexistente'
                });
            }

            //Validamos que exista el ID_ROL
            const ID_ROL = await pool.query(consulta.get(ROLES.TABLA, params.ID_ROL));
            if(ID_ROL.length == 0){
                return res.status(400).send({
                    'message': 'Rol inexistente'
                });
            }
            
            //validamos que no se repita el registro
            const user_ID_ROL = await pool.query(consulta.custom(`SELECT * FROM ${USUARIOS_ROLES.TABLA} 
            WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${params.ID_USUARIO}
            AND ${USUARIOS_ROLES.ID_ROL} = ${params.ID_ROL} AND ${USUARIOS_ROLES.ESTATUS} = ${params.ESTATUS}`  ))

            if(user_ID_ROL.length == 0){

                //Guardamos en la base de datos
                ID_ROLes_user = ID_ROLes_user[0]
                const data = {
                    ID_USUARIO: (params.ID_USUARIO == '')?ID_ROLes_user.ID_USUARIO:params.ID_USUARIO,
                    ID_ROL:  (params.ID_ROL == '')?ID_ROLes_user.ID_ROL:params.ID_ROL,
                    ID_USUARIO_ALTA: req.user.sub,
                    FECHA: ID_ROLes_user.FECHA,
                    ESTATUS:  (params.ESTATUS == '')?ID_ROLes_user.ESTATUS:params.ESTATUS
                }

                
                await pool.query(consulta.custom(`UPDATE ${USUARIOS_ROLES.TABLA} SET ${USUARIOS_ROLES.ID_USUARIO} = ${data.ID_USUARIO}, 
                    ${USUARIOS_ROLES.ID_ROL} = ${data.ID_ROL}, ${USUARIOS_ROLES.ESTATUS} = ${data.ESTATUS} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${ID_USUARIO}
                    AND ${USUARIOS_ROLES.ID_ROL} = ${ID_ROL} `));

                return res.status(200).send({
                    'message': 'Usuario y ID_ROL actualizados exitosamente',
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

        let ID_USUARIO = req.params.ID_USUARIO;
        let ID_ROL = req.params.ID_ROL
        console.log(consulta.custom(`DELETE FROM ${USUARIOS_ROLES.TABLA} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${ID_USUARIO}
        AND ${USUARIOS_ROLES.ID_ROL} = ${ID_ROL}`))
        const borrar = await pool.query(consulta.custom(`DELETE FROM ${USUARIOS_ROLES.TABLA} WHERE ${USUARIOS_ROLES.ID_USUARIO} = ${ID_USUARIO}
        AND ${USUARIOS_ROLES.ID_ROL} = ${ID_ROL}`));

        return res.status(200).send({
            'message': 'Se le eliminó el ID_ROL al ID_USUARIO exitosamente',
        }); 
    }
}

module.exports = ID_USUARIOs_ID_ROLes;