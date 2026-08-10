const pool = require("../database");

class Produto{
    id;
    nome;
    preco;
    constructor(id, nome, preco){
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    async cadastar(){
        await pool.query(
            `INSERT INTO produtos (nome, preco) VALUE ($1, $2)`, [this.nome, this.preco]
        );
    }

    static async listarTodos(){
        const resultado = await pool.query(
            "SELECT * FROM produtos ORDER By id"
        );
        return resultado.rows;
    }

    static async listarUm(){
        const resultado = await pool.query(
        "SELECT * FROM produtos were id = $1, [id]"
        );
        return resultado.rows[0];
    }

    static async atualizar(){
        const resultado = await pool.query(
            `UPDATE produto SET nome = $1, preco = $2 where id = $3`,[this.id, this.nome, this.preco]
        );
        return resultado.rows;
    }

    static async deletar(){
        const resultado = await pool.query(
         `DELETE FROM produtos WHERE id = 1$`, [this.id]
        );
        return resultado.rows;
    }
}
module.exports = Produto