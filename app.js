const express = require('express');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(express.json()); // Permite ler JSON no corpo das requisições

app.use(clienteRoutes);
app.use(produtoRoutes);
app.use(pedidosRoutes);
app.use(usuarioRoutes);

app.use(express.static("views"));

const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor rodando com sucesso na porta ${porta}`);
});
