const pool = require("../database");

class Pedido {
    cliente_id;
    produtos;

    constructor(cliente_id, produtos) {
        this.cliente_id = cliente_id;
        this.produtos = produtos; // Array de objetos ex: [{ produto_id: 1, quantidade: 2 }]
    }

    // Método de instância para cadastrar o próprio pedido
    async cadastrar() {
        // Correção: pool.connect() devolve uma promessa, usamos o await para pegar o 'client'
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // 1. Cria o pedido principal (Corrigido o nome da tabela e variáveis)
            const pedidoRes = await client.query(
                "INSERT INTO pedidos (cliente_id) VALUES ($1) RETURNING id", 
                [this.cliente_id]
            );
            const pedidoId = pedidoRes.rows[0].id;

            // 2. Insere os produtos na tabela intermediária (pedido_produtos)
            for (let prod of this.produtos) {
                // Ajustado os nomes das colunas de acordo com o padrão SQL comum
                await client.query(
                    "INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
                    [pedidoId, prod.produto_id, prod.quantidade || 1]
                );
            }

            await client.query("COMMIT");
            return { id: pedidoId, cliente_id: this.cliente_id, produtos: this.produtos };
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release(); // Liberta a conexão de volta para o pool
        }
    }

    static async findAll() {
        const resultado = await pool.query("SELECT * FROM pedidos ORDER BY id");
        return resultado.rows;
    }

    static async findById(id) {
        const resultado = await pool.query("SELECT * FROM pedidos WHERE id = $1", [id]);
        return resultado.rows[0];
    }

    static async atualizar(id, cliente_id, produtos) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            
            // Atualiza o cliente do pedido
            await client.query("UPDATE pedidos SET cliente_id = $1 WHERE id = $2", [cliente_id, id]);
            
            // Remove os produtos antigos do pedido para reinserir os novos atualizados
            await client.query("DELETE FROM pedido_produtos WHERE pedido_id = $1", [id]);
            
            for (let prod of produtos) {
                await client.query(
                    "INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
                    [id, prod.produto_id, prod.quantidade || 1]
                );
            }
            await client.query("COMMIT");
            return { id, cliente_id, produtos };
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }

    static async deletar(id) {
        // Deleta os vínculos primeiro devido às chaves estrangeiras (Foreign Keys)
        await pool.query('DELETE FROM pedido_produtos WHERE pedido_id = $1', [id]);
        const resultado = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
        return resultado.rowCount > 0;
    }
}

module.exports = Pedido;