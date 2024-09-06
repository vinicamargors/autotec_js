const express = require('express');
const router = express.Router();
const osController = require('../controllers/osController');
const authenticateToken = require('../middleware/authMiddleware');

// Rotas para ordens de serviço
router.get('/', authenticateToken, osController.listAll);
router.post('/', authenticateToken, osController.create);
router.get('/:id', authenticateToken, osController.getById);
router.put('/:id', authenticateToken, osController.update);
router.delete('/:id', authenticateToken, osController.delete); // Apenas admins podem deletar

module.exports = router;