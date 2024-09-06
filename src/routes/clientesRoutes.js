const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const authenticateToken = require('../middleware/authMiddleware');

// Rotas para clientes
router.get('/', authenticateToken, clientesController.listAll);
router.post('/', authenticateToken, clientesController.create); // Apenas admins podem criar
router.get('/:id', authenticateToken, clientesController.getById);
router.put('/:id', authenticateToken, clientesController.update); // Apenas admins podem editar
router.delete('/:id', authenticateToken, clientesController.delete); // Apenas admins podem deletar

module.exports = router;