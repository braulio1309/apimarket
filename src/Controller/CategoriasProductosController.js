//Librerías y servicios
const validator = require('validator');
const CATEGORIAS_PRODUCTOS = require('../Models/Categorias_productos');
const moment = require('moment');
const pool = require('../../database')
const consulta = require('../database/mysql')
const date = new Date();

const categorias = {
    crear:async function(req, res){
        let params = req.body;
        //Validar datos
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.slug   = (params.slug == undefined)?'':params.slug;
        params.categoria_padre   = (params.categoria_padre == undefined)?null:params.categoria_padre;

        let validate_nombre    = !validator.isEmpty(params.nombre);
        let validate_slug = !validator.isEmpty(params.slug);

        if(validate_nombre && validate_slug){
            //Valido que ese nombre ya no esté tomado
            const categoria = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.NOMBRE, params.nombre, 'equals'));
            if(categoria.length > 0){
                return res.status(400).send({
                    'message': 'El nombre ya ha sido tomado'
                });
            }

            //Valido que ese slug ya no esté tomado
            const slug = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.SLUG, params.slug, 'equals'));
            if(slug.length > 0){
                return res.status(400).send({
                    'message': 'El slug ya ha sido tomado'
                });
            }

            //valido que exista la categoria padre
            if(params.categoria_padre){
                const id_padre = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.ID, params.categoria_padre, 'equals'));
                if(id_padre.length == 0){
                    return res.status(400).send({
                        'message': 'La categoría padre no existe'
                    });
                }
            }

            const data = {
                DES_NOMBRE_CATEGORIA: params.nombre,
                DES_SLUG_CATEGORIA: params.slug,
                ID_CATEGORIA_PADRE: params.categoria_padre,
                FECHA: date,
                ESTATUS: 1
            }

            if(consulta.funciones.insertTable(CATEGORIAS_PRODUCTOS.TABLA, data)){
                return res.status(400).send({
                    'message': 'La categoría fue almacenada con exito',
                    'categoria': data
                });
            }else{
                return res.status(400).send({
                    'message': 'Error al insertar'
                });
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }
    },

    mostrar:async function(req, res){
        let user =  consulta.funciones.paginated_query(req, res, 'SELECT * FROM categorias', null)
        

         return user
    },

    listar:async function(req, res){

        const KEY = req.body.KEY;
        const VALUE = req.body.VALUE;
        const COMPARATOR = req.body.COMPARATOR;
        const data = consulta.funciones.paginated_query(req, res, consulta.search('categorias', KEY, VALUE, COMPARATOR))

        return data;
    },

    update:async function(req, res){

        let params = req.body;

        //Validar datos
        const id = req.params.id
        params.nombre   = (params.nombre == undefined)?'':params.nombre;
        params.slug   = (params.slug == undefined)?'':params.slug;
        params.categoria_padre   = (params.categoria_padre == undefined)?null:params.categoria_padre;
        params.estatus   = (params.estatus == undefined)?'':params.estatus;

        let validate_nombre    = !validator.isEmpty(params.nombre);
        let validate_slug = !validator.isEmpty(params.slug);
        let validate_categoria_padre  = !validator.isEmpty(params.categoria_padre);
        let validate_estatus  = !validator.isEmpty(params.estatus);

        if(validate_nombre || validate_slug || validate_estatus || validate_categoria_padre){

            //Valido que exista el id
            let cat = await pool.query(consulta.get(CATEGORIAS_PRODUCTOS.TABLA, id));
            if(cat.length == 0){
                return res.status(400).send({
                    'message': 'El registro no existe'
                });
            }
            cat = cat[0]
            //Valido que ese nombre ya no esté tomado
            const categoria = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.NOMBRE, params.nombre, 'equals'));
            if(categoria.length > 0 && cat.DES_NOMBRE_CATEGORIA != params.nombre){
                return res.status(400).send({
                    'message': 'El nombre ya ha sido tomado'
                });
            }

            //Valido que ese slug ya no esté tomado
            const slug = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.SLUG, params.slug, 'equals'));
            if(slug.length > 0 && cat.DES_SLUG_CATEGORIA != params.slug){
                return res.status(400).send({
                    'message': 'El slug ya ha sido tomado'
                });
            }

            //valido que exista la categoria padre
            if(params.categoria_padre){
                const id_padre = await pool.query(consulta.search(CATEGORIAS_PRODUCTOS.TABLA, CATEGORIAS_PRODUCTOS.ID, params.categoria_padre, 'equals'));
                if(id_padre.length == 0){
                    return res.status(400).send({
                        'message': 'La categoría padre no existe'
                    });
                }
            }

            const data = {
                ID: cat.ID,
                DES_NOMBRE_CATEGORIA: (params.nombre == '')?cat.DES_NOMBRE_CATEGORIA:params.nombre,
                DES_SLUG_CATEGORIA: (params.slug == '')?cat.DES_SLUG_CATEGORIA:params.slug,
                ID_CATEGORIA_PADRE: (params.categoria_padre == '')?cat.ID_CATEGORIA_PADRE:params.categoria_padre,
                FECHA: cat.FECHA,
                ESTATUS: (params.estatus == '')?cat.ESTATUS:params.estatus
            }

            if(consulta.funciones.update(CATEGORIAS_PRODUCTOS.TABLA, data)){
                return res.status(400).send({
                    'message': 'La categoría fue actualizada con exito',
                    'categoria': data
                });
            }else{
                return res.status(400).send({
                    'message': 'Error al insertar'
                });
            }
        }else{
            return res.status(400).send({
                'message': 'Datos incorrectos, intentelo de nuevo'
            });
        }
    },

    delete:async function(req, res){
       
        const borrar = await pool.query(consulta.remove(CATEGORIAS_PRODUCTOS.TABLA, req.params.id));
        return res.status(200).send({
            'message': 'Categoría eliminado exitosamente',
         
        });
        
    }
}

module.exports = categorias