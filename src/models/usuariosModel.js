const db = require('../../db');

// Função para listar todos os usuários
exports.findAll = (callback) => {
  db.query('SELECT * FROM tbusuarios', (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

// Função para criar um novo usuário
exports.create = (usuario, callback) => {
  db.query('INSERT INTO tbusuarios SET ?', usuario, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.insertId);
  });
};

// Função para encontrar um usuário por ID
exports.findById = (id, callback) => {
  db.query('SELECT * FROM tbusuarios WHERE id = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

// Função para atualizar um usuário
exports.update = (id, usuario, callback) => {
  db.query('UPDATE tbusuarios SET ? WHERE id = ?', [usuario, id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};

// Função para excluir um usuário
exports.delete = (id, callback) => {
  db.query('DELETE FROM tbusuarios WHERE id = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};

// Função para encontrar um usuário por login
exports.findByLogin = (login, callback) => {
  db.query('SELECT * FROM tbusuarios WHERE login = ?', [login], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};
