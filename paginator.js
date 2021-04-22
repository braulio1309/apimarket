const Paginator = require('mysql-paginator');

const paginator = new Paginator({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'apimarket'
  }    
);

module.exports = paginator;