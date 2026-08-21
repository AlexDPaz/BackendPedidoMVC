const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

class UsuarioController {
    async cadastrar(req, res) {
        const senhaHash = await bcrypt.hash(req.body.senha, 10);
        const usuario = new Usuario(null, req.body.nome, req.body.email, senhaHash);
        await usuario.cadastrar();
        res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    }

    async login(req, res) {
        const usuario = await Usuario.buscarPorEmail(req.body.email);
        if (!usuario) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        }
        const senhaCorreta = await bcrypt.compare(req.body.senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        }
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET
        );
        res.json({ token: token });
    }

    async consultar(req, res) {
        let usuario = await Usuario.consultar();
        res.json(usuario);
    }

    async alterar(req, res) {
        let usuario = new Usuario(req.params.id, req.body.nome, req.body.email);
        
        // ALTERAÇÃO AQUI: Inserido o 'await' para aguardar o banco de dados
        await usuario.alterar(); 
        
        res.json({ mensagem: "Usuário alterado com sucesso", usuario });
    }

    async deletar(req, res) { 
        let usuario = new Usuario(req.params.id);
        
        // ALTERAÇÃO AQUI: Inserido o 'await' para aguardar o banco de dados
        await usuario.delete(); 
        
        res.json({ mensagem: "Usuário deletado com sucesso" }); 
    }
}
module.exports = new UsuarioController();