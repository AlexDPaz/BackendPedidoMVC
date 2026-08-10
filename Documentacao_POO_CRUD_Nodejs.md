**Documentação Técnica: Backend CRUD e Conceitos Avançados**

_Guia explicativo sobre arquitetura Node.js, padrão MVC em POO e controle de transações SQL_

**1\. Visão Geral da Arquitetura e Estrutura**

Este documento compila as explicações técnicas detalhadas relativas à construção do backend do projeto POO - CRUD EXERCICIO. A arquitetura segue o padrão MVC (Model-View-Controller) orientada a objetos em Node.js com banco de dados PostgreSQL/MySQL.

**2\. Padrão de Nomenclatura nos Controllers**

No desenvolvimento de APIs RESTful, adota-se uma convenção universal de nomes para os métodos do Controller. Essa convenção facilita a legibilidade e o mapeamento direto das operações do CRUD (Create, Read, Update, Delete) com os verbos e rotas HTTP.

| **Método no Controller** | **Letra do CRUD** | **Ação Executada na Prática**                       | **Rota HTTP Padrão** |
| ------------------------ | ----------------- | --------------------------------------------------- | -------------------- |
| **index**                | R (Read)          | Lista todos os registros da tabela.                 | GET /recurso         |
| **show**                 | R (Read)          | Busca e exibe apenas um registro específico por ID. | GET /recurso/:id     |
| **create**               | C (Create)        | Cria e insere um novo registro no banco.            | POST /recurso        |
| **update**               | U (Update)        | Atualiza os dados de um registro existente.         | PUT /recurso/:id     |
| **delete**               | D (Delete)        | Remove/deleta um registro do banco de dados.        | DELETE /recurso/:id  |

**3\. Entendendo o Operador Ternário no JavaScript**

O operador ternário é uma forma sucinta de escrever condicionais \`if/else\` numa única linha de código. É amplamente utilizado em controllers para determinar a resposta HTTP com base no resultado retornado do banco.

**Exemplo no Controller:**

item ? res.json(item) : res.status(404).json({ error: 'Não encontrado' });

**Equivalente em \`if / else\` tradicional:**

if (item) {  
// Se o banco encontrou o registro (Verdadeiro)  
res.json(item);  
} else {  
// Se o retorno for nulo ou indefinido (Falso)  
res.status(404).json({ error: 'Não encontrado' });  
}

Sintaxe: Condição ? Retorno Verdadeiro : Retorno Falso;

• item ?: O JavaScript valida se a variável contém dados válidos (truthy) ou se está vazia/nula (falsy).  
• res.json(item): Executado se verdadeiro, retornando o objeto retornado com status HTTP 200 OK.  
• : (Dois Pontos): Atua como a cláusula 'else' (senão).  
• res.status(404)...: Executado se falso, retornando o erro HTTP 404 (Not Found).

**4\. Controle de Transações (\`BEGIN\`)**

Ao criar um Pedido que contém múltiplos produtos, é necessário alterar mais de uma tabela no banco de dados (\`pedidos\` e \`pedido_produtos\`). Para evitar a criação de pedidos parciais ou corrompidos em caso de falhas, utilizam-se Transações (ACID).

**• Início da Transação:** await client.query('BEGIN');

O comando BEGIN instrui o banco de dados a entrar em modo de transação temporária. Todas as operações subsequentes (INSERT, UPDATE, DELETE) ficam armazenadas em uma área de memória reservada e não são gravadas permanentemente até a confirmação explícita.

**Importante:** Por que não utilizar \`SELECT \* FROM clientes\` no lugar de \`BEGIN\`?

O comando SELECT é uma consulta de leitura (DQL) e não tem autoridade para iniciar uma transação. Se substituir o BEGIN por um SELECT, cada INSERT feito na sequência será gravado no banco imediatamente (autocommit). Caso ocorra uma falha no meio do processo de inserção dos produtos, o pedido principal permanecerá salvo sem nenhum produto associado, gerando incoerência de dados.

**5\. Recuperando IDs Gerados Automaticamente (\`RETURNING \*\`)**

Como os IDs dos pedidos são gerados automaticamente pelo banco (ex: colunas SERIAL ou AUTO_INCREMENT), precisamos obter o ID recém-gerado para usá-lo na tabela relacional \`pedido_produtos\`.

// 1. Cria o pedido e solicita o retorno do registro completo recém-criado  
const pedidoRes = await client.query(  
'INSERT INTO pedidos (cliente_id) VALUES (\$1) RETURNING \*',  
\[cliente_id\]  
);  
<br/>// 2. Extrai o ID gerado automaticamente pelo banco de dados  
const pedidoId = pedidoRes.rows\[0\].id;  
<br/>// 3. Usa o pedidoId para relacionar cada produto na tabela intermediária  
for (let prod of produtos) {  
await client.query(  
'INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES (\$1, \$2, \$3)',  
\[pedidoId, prod.produto_id, prod.quantidade || 1\]  
);  
}

**6\. Ciclo de Vida da Transação: COMMIT, ROLLBACK e client.release()**

A execução de uma transação é gerenciada com um bloco \`try / catch / finally\`:

try {  
await client.query('BEGIN');  
<br/>// Operações de Inserção...  
<br/>await client.query('COMMIT'); // 1. Garante a gravação definitiva no disco  
return { id: pedidoId, cliente_id, produtos };  
<br/>} catch (error) {  
await client.query('ROLLBACK'); // 2. Desfaz absolutamente tudo em caso de falha  
throw error;  
<br/>} finally {  
client.release(); // 3. Devolve a conexão ao pool (OBRIGATÓRIO)  
}

**•** COMMIT: Disparado no final do bloco \`try\`. Confirma todas as modificações temporárias e as grava permanentemente no disco rígido.

**•** ROLLBACK: Disparado dentro do bloco \`catch\`. Se qualquer linha dentro do \`try\` falhar, o ROLLBACK desfaz todas as alterações ocorridas desde o \`BEGIN\`, deixando o banco limpo.

**•** client.release(): Disparado dentro do bloco \`finally\`. Independente de dar certo ou errado, a conexão obtida com \`db.connect()\` deve ser liberada de volta para o Pool de conexões do servidor. Deixar de chamar o \`release()\` pode esgotar o limite de conexões do banco, travando a API.