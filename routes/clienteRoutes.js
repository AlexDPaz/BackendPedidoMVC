const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/cliente', ClienteController.cadastar);
router.get('/cliente', ClienteController.listarTodos);
router.get('/cliente/:id', ClienteController.listarUm);
router.put('/cliente/:id', ClienteController.atualizar);
router.delete('/cliente/:id', ClienteController.deletar);

module.exports = router;