const jwt = require('jsonwebtoken');
const usuariosModel = require('../models/usuariosModel');


const secretKey = 'secreta'; // Substitua por uma chave secreta mais segura

// Função para autenticar o usuário e gerar o token JWT
exports.login = (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são necessários.' });
  }

  usuariosModel.findByLogin(login, (err, usuario) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verifica a senha
    if (senha !== usuario.senha) { // Comparação direta, pois a senha não está criptografada
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: usuario.id, login: usuario.login }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  });
};

// Função para criar um novo usuário
exports.create = (req, res) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ error: 'Senha é necessária para criar um usuário.' });
  }

  // Criação de novo usuário sem criptografia de senha
  const novoUsuario = { ...req.body, senha };

  usuariosModel.create(novoUsuario, (err, usuarioId) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
    res.status(201).json({ id: usuarioId, ...novoUsuario });
  });
};

// Função para listar todos os usuários
exports.listAll = (req, res) => {
  usuariosModel.findAll((err, usuarios) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
    res.json(usuarios);
  });
};

// Função para buscar um usuário por ID
exports.getById = (req, res) => {
  const id = req.params.id;
  usuariosModel.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  });
};

// Função para atualizar um usuário
exports.update = (req, res) => {
  const id = req.params.id;
  const usuarioAtualizado = req.body;

  usuariosModel.update(id, usuarioAtualizado, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ id, ...usuarioAtualizado });
  });
};

// Função para excluir um usuário
exports.delete = (req, res) => {
  const id = req.params.id;
  usuariosModel.delete(id, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(204).send();
  });
};
