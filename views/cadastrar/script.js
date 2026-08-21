const formCadastro = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

formCadastro.addEventListener("submit", async (event) => {
    // Faz com que a página não atualize ao enviar o formulário
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não são iguais.";
        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/usuario",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.mensagem || "Erro ao realizar cadastro.";
            return;
        }

        // Limpa o formulário
        formCadastro.reset();

        // Redireciona para o login
        window.location.href = "../login";
    }
    catch (erro) {
        mensagem.textContent = "Não foi possível conectar com a API.";
        console.error(erro);
    }
});