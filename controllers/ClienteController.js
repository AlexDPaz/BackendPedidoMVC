const Cliente = require("../model/Cliente");

class ClienteController{
    async cadastar(req, res){
        const {nome, email} = req.body;
        const cliente = await Cliente.cadastar(nome, email);
        res.json(cliente);
    }

    async listarTodos(req, res){
        const lista = await Cliente.findAll();
        res.json(lista);
    }

    async listarUm(req, res){
        const iten = await Cliente.filndById(req.params.id);
        if(item){
        res.json(iten);
        }
        else{
            res.status(404).json({error: "Nenhum item encontrado"});
        }
    }

    async atualizar(req, res){
        const {id, nome, email} = req.body;
        const atualizar = await Cliente.atualizar(id, nome, email);
        res.json(atualizar);
    }

    async deletar(req, res){
        const deletarIten = await cliente.deletar(req.params.id);
        if (deletarIten){
            res.json("Deletado com  sucesso");
        }
        else{
            res.json({error:"Verifique ID a ser deletado"});
        }
    }

}
module.exports = new ClienteController;