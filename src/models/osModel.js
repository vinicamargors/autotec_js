const db = require('../../db');

// Função para listar todas as ordens de serviço
exports.findAll = (callback) => {
  //console.log('Consultando todas as ordens de serviço');
  db.query(`
    SELECT tbos.*, tbclientes.nome AS nome_cliente
    FROM tbos
    JOIN tbclientes ON tbos.idclie = tbclientes.id
  `, (err, results) => {
    if (err) {
      console.error('Erro ao consultar ordens de serviço:', err);
      return callback(err);
    }
    //console.log('Resultados da consulta:', results);
    callback(null, results);
  });
};

// Função para criar uma nova ordem de serviço
exports.create = (ordem, callback) => {
  console.log('Inserindo nova ordem de serviço:', ordem);
  db.query('INSERT INTO tbos SET ?', ordem, (err, results) => {
    if (err) {
      console.error('Erro ao inserir ordem de serviço:', err);
      return callback(err);
    }
    console.log('Ordem de serviço inserida com ID:', results.insertId);
    callback(null, results.insertId);
  });
};

// Função para encontrar uma ordem de serviço por ID
exports.findById = (id, callback) => {
  //console.log('Consultando ordem de serviço por ID:', id);
  db.query('SELECT * FROM tbos WHERE os = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar ordem de serviço por ID:', err);
      return callback(err);
    }
    //console.log('Resultado da consulta por ID:', results[0]);
    callback(null, results[0]);
  });
};

// Função para atualizar uma ordem de serviço
exports.update = (id, ordem, callback) => {
  // Certifique-se de que lista_servicos é uma string JSON
  if (ordem.lista_servicos && typeof ordem.lista_servicos === 'object') {
    ordem.lista_servicos = JSON.stringify(ordem.lista_servicos);
  }

  console.log('Atualizando ordem de serviço ID:', id, 'com dados:', ordem);
  db.query('UPDATE tbos SET ? WHERE os = ?', [ordem, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar ordem de serviço:', err);
      return callback(err);
    }
    console.log('Linhas afetadas na atualização:', results.affectedRows);
    callback(null, results.affectedRows);
  });
};

// Função para excluir uma ordem de serviço
exports.delete = (id, callback) => {
  console.log('Excluindo ordem de serviço ID:', id);
  db.query('DELETE FROM tbos WHERE os = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir ordem de serviço:', err);
      return callback(err);
    }
    console.log('Linhas afetadas na exclusão:', results.affectedRows);
    callback(null, results.affectedRows);
  });
};
