const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

router.post('/pedidos', PedidoController.criar);
router.get('/pedidos', PedidoController.listarTodos);
router.get('/pedidos/:id', PedidoController.listarUm);
router.put('/pedidos/:id', PedidoController.atualizar);
router.delete('/pedidos/:id', PedidoController.deletar);

module.exports = router;