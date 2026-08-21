const jwt = require("jsonwebtoken");

function autenticacao(req, res, next) {
   const authHeader = req.headers.authorization;
   if (!authHeader) {
       return res.status(401).json({mensagem: "Token não informado"});
   }
   const partes = authHeader.split(" ");
   const token = partes[1];
   try {
       const usuario = jwt.verify(token, process.env.JWT_SECRET);
       req.usuario = usuario;
       next();
   } catch (erro) {
       return res.status(401).json({mensagem: "Token inválido"});
   }
}

module.exports = autenticacao;