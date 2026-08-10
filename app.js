const express = require('express');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();

app.use(express.json()); // Permite ler JSON no corpo das requisições

app.use(clienteRoutes);
app.use(produtoRoutes);
app.use(pedidosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
});
