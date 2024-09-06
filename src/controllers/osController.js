const osModel = require('../models/osModel');

exports.listAll = (req, res) => {
  console.log('Chamando listAll');
  osModel.findAll((err, ordens) => {
    if (err) {
      console.error('Erro ao listar ordens de serviço:', err);
      return res.status(500).json({ error: 'Erro ao listar ordens de serviço' });
    }

    // Agora incluímos os nomes dos clientes nas ordens
    const ordersWithClients = ordens.map(ordem => ({
      ...ordem,
      cliente: ordem.nome_cliente  // Inclua o nome do cliente aqui
    }));

    console.log('Ordens de serviço com clientes:', ordersWithClients);
    res.json(ordersWithClients);
  });
};

exports.create = (req, res) => {
  console.log('Criando nova ordem de serviço:', req.body);
  const novaOrdem = req.body;
  novaOrdem.data_os = new Date(); // Define a data atual

  osModel.create(novaOrdem, (err, ordemId) => {
    if (err) {
      console.error('Erro ao criar ordem de serviço:', err);
      return res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
    }
    console.log('Ordem criada com ID:', ordemId);
    res.status(201).json({ os: ordemId, ...novaOrdem });
  });
};

exports.getById = (req, res) => {
  console.log('Buscando ordem de serviço por ID:', req.params.id);
  const id = req.params.id;
  osModel.findById(id, (err, ordem) => {
    if (err) {
      console.error('Erro ao buscar ordem de serviço:', err);
      return res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
    }
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    console.log('Ordem de serviço encontrada:', ordem);
    res.json(ordem);
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const ordemAtualizada = req.body;

  // Converte a lista_servicos para JSON e calcula o valor total
  if (ordemAtualizada.lista_servicos) {
    try {
      const listaServicos = JSON.parse(ordemAtualizada.lista_servicos);
      const valorTotal = listaServicos.reduce((total, servico) => total + parseFloat(servico.price), 0);
      ordemAtualizada.valor = valorTotal; // Atualiza o valor total calculado
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao processar a lista de serviços' });
    }
  }

  // Atualiza a ordem de serviço
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
  console.log('Excluindo ordem de serviço ID:', req.params.id);
  const id = req.params.id;
  osModel.delete(id, (err, affectedRows) => {
    if (err) {
      console.error('Erro ao excluir ordem de serviço:', err);
      return res.status(500).json({ error: 'Erro ao excluir ordem de serviço' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    console.log('Ordem de serviço excluída com sucesso');
    res.status(204).send();
  });
};
