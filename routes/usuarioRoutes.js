const express = require("express");
const router = express.Router();
const controller = require("../controllers/UsuarioController");
const autenticacao = require("../middlewares/autenticacao");

// Rotas Livres
router.post("/api/usuario", controller.cadastrar);
router.post("/api/login", controller.login);

// Rotas Protegidas
router.get("/api/usuario", autenticacao, controller.consultar);
router.put("/api/usuario/:id", autenticacao, controller.alterar);
router.delete("/api/usuario/:id", autenticacao, controller.deletar); 

module.exports = router;