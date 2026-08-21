const pool = require("../database");

class Cliente {
    constructor(id, nome, email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    async cadastar() {
        // Corrigido para VALUES
        await pool.query(
            `INSERT INTO cliente (nome, email) VALUES ($1, $2)`, [this.nome, this.email]
        );
    }

    static async listarTodos() {
        const resultado = await pool.query(
            "SELECT * FROM cliente ORDER BY id"
        );
        return resultado.rows;
    }

    static async listarUm(id) { // Adicionado parâmetro id
        // Corrigido 'were' para 'WHERE' e fechamento da string SQL
        const resultado = await pool.query(
            "SELECT * FROM cliente WHERE id = $1", [id]
        );
        return resultado.rows[0];
    }

    static async atualizar(id, nome, email) { // Alterado para receber os parâmetros diretamente
        const resultado = await pool.query(
            `UPDATE cliente SET nome = $1, email = $2 WHERE id = $3 RETURNING *`, [nome, email, id]
        );
        return resultado.rows[0];
    }

    static async deletar(id) { // Adicionado parâmetro id e corrigido a tabela para 'cliente'
        const resultado = await pool.query(
            `DELETE FROM cliente WHERE id = $1 RETURNING *`, [id]
        );
        return resultado.rowCount > 0; // Retorna true se deletou algo
    }
}
module.exports = Cliente;