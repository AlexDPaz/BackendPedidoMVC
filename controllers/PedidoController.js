const Pedido = require("../model/Pedido");

class PedidoController{
    async criar(req, res){
        const {cliente, produtos} = req.body;
        const pedido = await Pedido.criar(cliente, produtos);
        res.json(pedido);
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