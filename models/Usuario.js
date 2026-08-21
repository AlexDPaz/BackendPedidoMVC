const pool = require("../database");
class Usuario {
   constructor(id, nome, email, senha) {
       this.id = id;
       this.nome = nome;
       this.email = email;
       this.senha = senha;
   }

   async cadastrar() {
       await pool.query(
           `INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3)`,
           [this.nome, this.email, this.senha]
       );
   }

   static async buscarPorEmail(email) {
       const resultado = await pool.query(
           "SELECT * FROM usuario WHERE email = $1",
           [email]
       );
       return resultado.rows[0];
   }

   static async consultar() {
    const resultado = await pool.query(
        "SELECT * FROM usuario" // Corrigido de 'usuarios' para 'usuario' conforme o padrão
    );
    return resultado.rows;
   }

   async alterar() {
    const resultado = await pool.query(
        "UPDATE usuario SET nome = $1, email = $2 WHERE id = $3 RETURNING *", // Corrigido comando SQL
        [this.nome, this.email, this.id]
    );
    return resultado.rows[0];
   }

   async delete() {
    const resultado = await pool.query(
        "DELETE FROM usuario WHERE id = $1 RETURNING *",
        [this.id]
    );
    return resultado.rows[0];
   }
}
module.exports = Usuario;