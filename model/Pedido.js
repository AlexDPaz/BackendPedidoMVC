const pool = require("../database");

class Pedido {
    cliente_id;
    produtos;
    produtos_id;
    quantidade;
    constructor(cliente_id, produtos, produtos_id, quantidade) {
        this.cliente_id = cliente_id;
        this.produtos = produtos;
        this.produtos_id = produtos_id;
        this.quantidade = quantidade;
    }
    //São os dados recebidos. O ID do cliente que está comprando e uma lista (array) com os produtos que ele escolheu.
    async cadastrar(cliente_id, produtos) {
        //O uso do pool.connect() é a prática recomendada para gerenciar conexões sem sobrecarregar o servidor
        // Transação para garantir que o pedido e os itens sejam salvos juntos
        const cliente = pool.connect();
        try {
            await cliente.query("BEGIN")// Esta linha envia o comando BEGIN para o banco de dados. Ele avisa o banco: 
            //"Olha, vou começar uma operação importante agora. Não salve nada em definitivo ainda, apenas guarde as alterações na memória."

            // 1. Cria o pedido principal
            const pdedidoRes = await cliente.query("INSERT INTO pedidos (cliente_id) VALUES ($1)", [this.cliente_id]);
            const pedidoId = pedidoId.rows[0].id;

            // 2. Insere os produtos na tabela intermediária (pedido_produtos)
            let prod;
            for (prod of produtos) {
                await cliente.query(
                    "INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUEs ($1, $2, $3)",
                    [pedidoId, prod.produto_id, prod.quantidade || 1]
                );
            }

            await cliente.query("COMMIT");
            return { id: pedidoId, cliente_id, produtos };
        }
        catch (error) {
            await cliente.query("ROLLBACK");
            throw error;
        }
        finally {
            cliente.release();
        }
    }

    static async listarTudos() {
        // Busca os pedidos trazendo os dados do cliente
        const resultado = await pool.query(
            `SELECT p.id, p.client_id, c.nome as cliente_nome
            FROM pedidos p
            join cliente c ON p.cliente_id = c.id`
        );
        return resultado.rows;
    }

    static async listarUm() {
        const pdedidoRes = await pool.query("SELECT * FROM pedidos WHERE id = $1", [this.id]);
        if (pdedidoRes.rows.length === 0)
            return null;

        // Busca os produtos vinculados a esse pedido específico
        const produtosRes = await pool.query(`
            SELECT pr.id, pr.nome, pr.preco, pp.quantidade
            FROM pedido_produtos pp
            JOIN produtos pr ON pp.produtos_id = pr.id
            WHERE pp.pedido_id = $1`, [this.id]
        );

        const pedido = pdedidoRes.rows[0];
        pedido.produtos = produtos = produtosRes.rows;
        return pedido;
    }

    static async atualizar() {
        const client = await pool.connect();
        try {
            await cliente.query("BEGIN");
            // Atualiza o cliente do pedido
            await cliente.query("UPDATE pedidos SET cliente_id = $1 WHERE id =$2", [this.cliente_id, this.id]);
            // Remove os produtos antigos do pedido para reinserir os novos atualizados
            await cliente.query("DELETE FROM pedido_produtos WHERE pedido_id = $1", [this.id]);
            let prod;
            for (prod of produtos) {
                await cliente.query(
                    "INSERT INTO pedido_produtos (pedido_id, quantidade) VALUES ($1, $2, $3)",
                    [this.id, prod.produto_id, prod.quantidade || 1]
                );
            }
            await cliente.query("COMMIT");
            return { id, cliente_id, produtos };
        }
        catch (error) {
            await cliente.query("ROLLBACK");
            throw error;
        }
        finally {
            cliente.release();
        }
    }

    static async deletar() {
        // O banco de dados configurado com ON DELETE CASCADE removeria automaticamente os itens,
        // caso contrário, removemos manualmente primeiro:
        await pool.query('DELETE FROM pedido_produtos WHERE pedido_id = $1', [this.id]);
        await pool.query('DELETE FROM pedidos WHERE id = $1', [this.id]);
        return true;
    }
}
module.exports = Pedido