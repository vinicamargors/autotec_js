const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authenticateToken = require('../middleware/authMiddleware');


// Rota pública para login
router.post('/login', usuariosController.login);

// Rota pública para criação de usuário (ajuste conforme necessário)
router.post('/', usuariosController.create);

// Rotas protegidas
router.get('/', authenticateToken, usuariosController.listAll);
router.get('/:id', authenticateToken, usuariosController.getById);
router.put('/:id', authenticateToken, usuariosController.update);
router.delete('/:id', authenticateToken, usuariosController.delete); // Protegido por autorização

module.exports = router;
