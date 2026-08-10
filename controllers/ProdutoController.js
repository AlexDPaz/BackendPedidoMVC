const Produto = require("../model/Produto");

class ProdutoController{
    async criar(req, res){
        const {nome, preco} = req.body;
        const produto = await Produto.criar(nome, preco);
        res.json(produto);
    }

    async listarTodos(req, res){
        const lista = await Produto.findAll();
        res.json(lista);
    }

    async listarUm(req, res){
        const iten = await Produto.filndById(req.params.id);
        if(item){
        res.json(iten);
        }
        else{
            res.status(404).json({error: "Nenhum item encontrado"});
        }
    }

    async atualizar(req, res){
        const {id, nome, preco} = req.body;
        const atualizar = await Produto.atualizar(id, nome, preco);
        res.json(atualizar);
    }

    async deletar(req, res){
        const deletarIten = await Produto.deletar(req.params.id);
        if (deletarIten){
            res.json("Deletado com  sucesso");
        }
        else{
            res.json({error:"Verifique ID a ser deletado"});
        }
    }

}
module.exports = new ProdutoController;