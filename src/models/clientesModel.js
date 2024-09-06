const db = require('../../db');

// Função para listar todos os clientes
exports.findAll = (callback) => {
  db.query('SELECT * FROM tbclientes', (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

// Função para criar um novo cliente
exports.create = (cliente, callback) => {
  db.query('INSERT INTO tbclientes SET ?', cliente, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.insertId);
  });
};

// Função para encontrar um cliente por ID
exports.findById = (id, callback) => {
  db.query('SELECT * FROM tbclientes WHERE id = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

// Função para atualizar um cliente
exports.update = (id, cliente, callback) => {
  db.query('UPDATE tbclientes SET ? WHERE id = ?', [cliente, id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};

// Função para excluir um cliente
exports.delete = (id, callback) => {
  db.query('DELETE FROM tbclientes WHERE id = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};
