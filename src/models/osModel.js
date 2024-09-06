const db = require('../../db');

// Função para listar todas as ordens de serviço
exports.findAll = (callback) => {
  db.query(`
    SELECT tbos.*, tbclientes.nome AS nome_cliente
    FROM tbos
    JOIN tbclientes ON tbos.idclie = tbclientes.id
  `, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};


// Função para criar uma nova ordem de serviço
exports.create = (ordem, callback) => {
  db.query('INSERT INTO tbos SET ?', ordem, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.insertId);
  });
};

// Função para encontrar uma ordem de serviço por ID
exports.findById = (id, callback) => {
  db.query('SELECT * FROM tbos WHERE os = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

// Função para atualizar uma ordem de serviço
exports.update = (id, ordem, callback) => {
  db.query('UPDATE tbos SET ? WHERE os = ?', [ordem, id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};

// Função para excluir uma ordem de serviço
exports.delete = (id, callback) => {
  db.query('DELETE FROM tbos WHERE os = ?', [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results.affectedRows);
  });
};
