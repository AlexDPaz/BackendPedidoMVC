const pool = require("../database");

class Produto {
    constructor(id, nome, preco) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    async cadastar() {
        await pool.query(
            `INSERT INTO produtos (nome, preco) VALUES ($1, $2)`, [this.nome, this.preco]
        );
    }

    static async listarTodos() {
        const resultado = await pool.query(
            "SELECT * FROM produtos ORDER BY id"
        );
        return resultado.rows;
    }

    static async listarUm(id) {
        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE id = $1", [id]
        );
        return resultado.rows[0];
    }

    static async atualizar(id, nome, preco) {
        const resultado = await pool.query(
            `UPDATE produtos SET nome = $1, preco = $2 WHERE id = $3 RETURNING *`, [nome, preco, id]
        );
        return resultado.rows[0];
    }

    static async deletar(id) {
        // Corrigido placeholder de '1$' para '$1'
        const resultado = await pool.query(
            `DELETE FROM produtos WHERE id = $1`, [id]
        );
        return resultado.rowCount > 0;
    }
}
module.exports = Produto;