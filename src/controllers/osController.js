const osModel = require('../models/osModel');

exports.listAll = (req, res) => {
  osModel.findAll((err, ordens) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar ordens de serviço' });
    }

    // Agora incluímos os nomes dos clientes nas ordens
    const ordersWithClients = ordens.map(ordem => ({
      ...ordem,
      cliente: ordem.nome_cliente  // Inclua o nome do cliente aqui
    }));

    res.json(ordersWithClients);
  });
};

exports.create = (req, res) => {
  const novaOrdem = req.body;
  novaOrdem.data_os = new Date(); // Define a data atual

  osModel.create(novaOrdem, (err, ordemId) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
    }
    res.status(201).json({ os: ordemId, ...novaOrdem });
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  osModel.findById(id, (err, ordem) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
    }
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json(ordem);
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const ordemAtualizada = req.body;
  osModel.update(id, ordemAtualizada, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.json({ os: id, ...ordemAtualizada });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  osModel.delete(id, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir ordem de serviço' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(204).send();
  });
};

