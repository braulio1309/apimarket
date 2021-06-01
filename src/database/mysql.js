const TABLA_USUARIOS = 'USUARIOS';
const COL_NOMBRE_USUARIO = 'DES_USUARIO';
const COL_PASS_USUARIO = 'DES_PASS';
const COL_TELEFONO_USUARIO = 'TELEFONO';
const COL_ESTATUS = 'ESTATUS';
const mysql= require('mysql2');
const paginate    = require('node-mysql-paginate');


//const pool = require('../../database')
const pool=mysql.createPool({
  host: 'localhost',
  user:'root',
  password: '',
  database: 'cheeseok_marketplace_test'
})

const promisePool = pool.promise();




const login = (user,pass) => {
  let consulta=`SELECT * FROM ${TABLA_USUARIOS} WHERE '${COL_NOMBRE_USUARIO}' = '${user}' AND '${COL_PASS_USUARIO}' = '${pass}' AND '${COL_ESTATUS}' > 0`;
  return consulta;
};

const list = (table) => {
  let consulta=`SELECT * FROM ${table}`;
  return consulta;
};

const count = (table, columName,) => {
  let consulta=`SELECT COUNT(${columName}) as TOTAL FROM ${table}`;
  return consulta;
};

const get = (table, id) => {
  let consulta=`SELECT * FROM ${table} WHERE id = ${id}`;
  return consulta;
};

const search = (table, columName, value, comparator) => {
  let consulta;
  switch (comparator) {
      case 'equals':
       consulta=`SELECT * FROM ${table} WHERE ${columName} = '${value}' `;
      break;

      case 'contains':
        consulta=`SELECT * FROM ${table} WHERE ${columName} LIKE '%${value}%' `;
       break;

      case 'contains-user':
       consulta=`SELECT * FROM ${table} WHERE ${columName} LIKE '%${value}%' OR '${COL_TELEFONO_USUARIO}' = '${value}'`;
      break;
  }
  return consulta;
};
 
const funciones = {

  insertTable: async function insertTable(tableName,params,res) {
    try{
      return await promisePool.query(
        `INSERT INTO ${tableName} SET ?`,params
      )
    }catch{
      console.log('Error al insertar')
      return 0;
    }
    
  
},
  
   update:async function update(table, data) {
    let consulta=`UPDATE ${table} SET ? WHERE id=?`;
    try{
      return await promisePool.query(consulta,[data, data.ID]);
    }catch{
      console.log('Error al insertar')
      return 0;
    }
  },

  paginated_query: async function paginated_query(req, res, query, params){
    let limit = 10;
    if(req.params.limit){
      limit = req.params.limit;
    }
    
    let page = 1;
    if(req.params.page){
      page = req.params.page;
    }
    
     paginate.paginate(pool, query,
      {
        page: page,
        limit: limit,
        params: params
      },
      function (err, rows) {
        if (err) {
          return res.status(400).send({
            'message': 'Datos incorrectos, intentelo de nuevo'
          });
          
        }
        
        return res.json(rows);
      }
    );
  }


};


const remove = (table, id) => {
  let consulta=`DELETE FROM ${table} WHERE id = ${id}`;
  return consulta;
};

const removeCustom = (table, columName, id) => {
  let consulta=`DELETE FROM ${table} WHERE ${columName} = ${id}`;
  return consulta;
};

const custom = (query) => {
  return query;
};

module.exports = {
  login,
  list,
  get,
  
  remove,
  search,
  count,
  custom,
  removeCustom,
  funciones
};
