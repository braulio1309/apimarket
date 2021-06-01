//Librerías y servicios
const validator = require('validator');
const IMPUESTOS = require('../Models/Impuestos');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const meta = {

    crear:async function(req, res) {
       
        let params = req.body;
        //Validar datos
        params.DES_NOMBRE   = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.NUM_VALOR   = (params.NUM_VALOR == undefined)?0:params.NUM_VALOR;

        let validate_DES_NOMBRE   = !validator.isEmpty(params.DES_NOMBRE);



        if(validate_DES_NOMBRE){
            

            //Verificamos si ya existe el impuesto
            const verifica = await pool.query(consulta.search(IMPUESTOS.TABLA, IMPUESTOS.NOMBRE, params.DES_NOMBRE, 'equals' ));
            
            if(verifica.length > 0){
                return res.status(400).send({
                    'message': 'El metadato  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    DES_NOMBRE: params.DES_NOMBRE,
                    NUM_VALOR: params.NUM_VALOR,
                    FECHA: date,
                    ESTATUS: 1
                }

                if(consulta.funciones.insertTable(IMPUESTOS.TABLA, data)){
                    return res.status(200).send({
                        'message': 'Impuesto registrado exitosamente',
                        'metaPedido': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al guardar el impuesto',
                        
                    }); 
                }
               
            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }
    },

    mostrar: async function(req, res){
       
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM impuestos', null)
        

         return user
        
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        
        const data = consulta.funciones.paginated_query(req, res, consulta.search('impuestos', KEY, VALUE, COMPARATOR))

        return data;
    },

    
    update:async function(req, res){
        let params = req.body;

        //Validar datos
        let id = req.params.id //ID por parametros
        
       
        //Validar datos
        params.DES_NOMBRE   = (params.DES_NOMBRE == undefined)?'':params.DES_NOMBRE;
        params.NUM_VALOR   = (params.NUM_VALOR == undefined)?0:params.NUM_VALOR;
        params.ESTATUS   = (params.ESTATUS == undefined)?'':params.ESTATUS;

        let validate_DES_NOMBRE   = !validator.isEmpty(params.DES_NOMBRE);



        if(validate_DES_NOMBRE || params.ESTATUS || params.NUM_VALOR){
            
            //Verificamos si existe 
            let impuesto = await pool.query(consulta.get(IMPUESTOS.TABLA, id));

            if(impuesto.length == 0){
                return res.status(400).send({
                    'message': 'El impuesto  no existe'
                });
            }
            impuesto = impuesto[0]

            //Verificamos si ya existe el impuesto
            const verifica = await pool.query(consulta.search(IMPUESTOS.TABLA, IMPUESTOS.NOMBRE, params.DES_NOMBRE, 'equals' ));
            
            if(verifica.length > 1){
                return res.status(400).send({
                    'message': 'El impuesto  ya existe'
                });
            }else{
                
                //Guardo en la base de datos
                const data = {
                    DES_NOMBRE: (params.DES_NOMBRE == '')?impuesto.DES_NOMBRE:params.DES_NOMBRE,
                    NUM_VALOR: (params.NUM_VALOR == '')?impuesto.NUM_VALOR:params.NUM_VALOR,
                    FECHA: date,
                    ESTATUS: (params.ESTATUS == '')?impuesto.ESTATUS:params.ESTATUS,
                }

                if(consulta.funciones.update(IMPUESTOS.TABLA, data)){
                    return res.status(200).send({
                        'message': 'Impuesto actualizado exitosamente',
                        'metaPedido': data
                    }); 
                }else{
                    return res.status(400).send({
                        'message': 'Error al guardar el impuesto',
                        
                    }); 
                }
               
            }

        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });

        }
    },

    delete:async function(req, res){
       
        const borrar = await pool.query(consulta.remove(IMPUESTOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Impuesto eliminado exitosamente',
         
        });
        
    }

}

module.exports = meta;