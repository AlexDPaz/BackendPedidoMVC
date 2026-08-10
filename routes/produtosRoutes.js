const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

router.post('/produtos', ProdutoController.criar);
router.get('/produtos', ProdutoController.listarTodos);
router.get('/produtos/:id', ProdutoController.listarUm);
router.put('/produtos/:id', ProdutoController.atualizar);
router.delete('/produtos/;id', ProdutoController.deletar);

module.exports = router;