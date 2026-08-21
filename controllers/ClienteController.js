const Cliente = require("../models/Cliente");

class ClienteController {
    async cadastar(req, res) {
        const { nome, email } = req.body;
        const cliente = await Cliente.cadastar(nome, email);
        res.json(cliente);
    }

    async listarTodos(req, res) {
        const lista = await Cliente.findAll(); // Nota: Garanta que o seu Model possui findAll ou use listarTodos()
        res.json(lista);
    }

    async listarUm(req, res) {
        // Corrigido para a função existente no seu Model e corrigido de 'iten' para 'item'
        const item = await Cliente.listarUm(req.params.id); 
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: "Nenhum item encontrado" });
        }
    }

    async atualizar(req, res) {
        const { id, nome, email } = req.body;
        const atualizar = await Cliente.atualizar(id, nome, email);
        res.json(atualizar);
    }

    async deletar(req, res) {
        // Corrigido 'cliente' para 'Cliente' e 'deletarIten' para 'deletarItem'
        const deletarItem = await Cliente.deletar(req.params.id);
        if (deletarItem) {
            res.json("Deletado com sucesso");
        } else {
            res.json({ error: "Verifique ID a ser deletado" });
        }
    }
}
module.exports = new ClienteController();
