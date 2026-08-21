const Produto = require("../models/Produto");

class ProdutoController {
    async criar(req, res) {
        const { nome, preco } = req.body;
        const produto = new Produto(null, nome, preco);
        await produto.cadastar();
        res.json({ mensagem: "Produto criado com sucesso!" });
    }

    async listarTodos(req, res) {
        const lista = await Produto.listarTodos();
        res.json(lista);
    }

    async listarUm(req, res) {
        const item = await Produto.listarUm(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: "Nenhum item encontrado" });
        }
    }

    async atualizar(req, res) {
        const { id, nome, preco } = req.body;
        const atualizar = await Produto.atualizar(id, nome, preco);
        res.json(atualizar);
    }

    async deletar(req, res) {
        const deletarItem = await Produto.deletar(req.params.id);
        if (deletarItem) {
            res.json("Deletado com sucesso");
        } else {
            res.json({ error: "Verifique ID a ser deletado" });
        }
    }
}
module.exports = new ProdutoController();
