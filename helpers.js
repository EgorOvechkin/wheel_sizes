const mysql = require('mysql');
const {promisify} = require('util');

function promisifyAll(exemplar) {
  const proto = Object.getPrototypeOf(exemplar);
  const asyncExemplar = Object.create(exemplar);
  for (let prop in proto) {
    if (typeof proto[prop] === 'function') {
      asyncExemplar[`${prop}Async`] = promisify(proto[prop]);
    }
  };
  return asyncExemplar;
};

function createMySQLConnection(options) {
  const connection = mysql.createConnection(options);
  const asyncConnection = promisifyAll(connection);
  asyncConnection.q = function(query) {
    console.log(query);
    return this.queryAsync(query);
  };
  return asyncConnection;
};

module.exports = {
  createMySQLConnection
}