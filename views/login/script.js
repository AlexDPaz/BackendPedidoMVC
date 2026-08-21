const formLogin = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagem");

formLogin.addEventListener("submit", async (event) => {
    // Faz com que a página não atualize ao enviar o formulário
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.mensagem || "Erro ao realizar login";
            return;
        }

        // Guarda o JWT
        localStorage.setItem("token", dados.token);

        // Vai para a página de usuários
        window.location.href = "/";
    } 
    catch (erro) {
        mensagem.textContent = "Não foi possível conectar com a API.";
        console.error(erro);
    }

});