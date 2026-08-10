const pool = require("../database");

class Cliente {
    id;
    nome;
    preco;
    constructor(id, nome, email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    async cadastar() {
        await pool.query(
            `INSERT INTO cliente (nome, email) VALUE ($1, $2)`, [this.nome, this.email]
        );
    }

    static async listarTodos() {
        const resultado = await pool.query(
            "SELECT * FROM cliente ORDER By id"
        );
        return resultado.rows;
    }

    static async listarUm() {
        const resultado = await pool.query(
            "SELECT * FROM cliente were id = $1, [id]"
        );
        return resultado.rows[0];
    }

    static async atualizar() {
        const resultado = await pool.query(
            `UPDATE cliente SET nome = $1, email = $2 where id = $3`, [this.id, this.nome, this.email]
        );
        return resultado.rows[0];
    }

    static async deletar() {
        const resultado = await pool.query(
            `DELETE FROM produtos WHERE id = $1`, [this.id]
        );
        return resultado.rows;
    }
}
module.exports = Cliente;
