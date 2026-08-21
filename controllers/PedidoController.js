const Pedido = require("../models/Pedido");

class PedidoController{
    
  async criar(req, res){
        const { cliente_id, produtos } = req.body;
        // Instancia a classe passando os dados para o construtor
        const pedido = new Pedido(cliente_id, produtos);
        try {
            const novoPedido = await pedido.cadastrar();
            res.json(novoPedido);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listarTodos(req, res){
        const lista = await Pedido.findAll();
        res.json(lista);
    }

    async listarUm(req, res){
        const iten = await Pedido.filndById(req.params.id);
        if(item){
        res.json(iten);
        }
        else{
            res.status(404).json({error: "Nenhum item encontrado"});
        }
    }

    async atualizar(req, res){
        const {id, cliente, produtos} = req.body;
        const atualizar = await Pedido.atualizar(id, cliente, produtos);
        res.json(atualizar);
    }

    async deletar(req, res){
        const deletarIten = await Pedido.deletar(req.params.id);
        if (deletarIten){
            res.json("Deletado com  sucesso");
        }
        else{
            res.json({error:"Verifique ID a ser deletado"});
        }
    }

}
module.exports = new PedidoController;