const clientesModel = require('../models/clientesModel');

exports.listAll = (req, res) => {
  clientesModel.findAll((err, clientes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar clientes' });
    }
    res.json(clientes);
  });
};

exports.create = (req, res) => {
  const novoCliente = req.body;
  clientesModel.create(novoCliente, (err, clienteId) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
    res.status(201).json({ id: clienteId, ...novoCliente });
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  clientesModel.findById(id, (err, cliente) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(cliente);
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const clienteAtualizado = req.body;
  clientesModel.update(id, clienteAtualizado, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json({ id, ...clienteAtualizado });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  clientesModel.delete(id, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(204).send();
  });
};
