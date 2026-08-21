// Pega o token do localStorage
const token = localStorage.getItem("token");

const listaUsuarios = document.getElementById("listaUsuarios");
const mensagem = document.getElementById("mensagem");
const btnConsultar = document.getElementById("btnConsultar");

// Verifica se existe token
if (!token) {
    window.location.href = "../login";
}

async function consultarUsuarios() {
    mensagem.textContent = "";
    try {
        const resposta = await fetch(
            "http://localhost:3000/api/usuario",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        if (resposta.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "../login";
            return;
        }

        if (!resposta.ok) {
            mensagem.textContent = dados.mensagem || "Erro ao consultar usuários";
            return;
        }

        listaUsuarios.innerHTML = "";
        dados.forEach(usuario => {
            const linha = document.createElement("tr");

            const colunaId = document.createElement("td");
            colunaId.textContent = usuario.id;

            const colunaNome = document.createElement("td");
            colunaNome.textContent = usuario.nome;

            const colunaEmail = document.createElement("td");
            colunaEmail.textContent = usuario.email;


            const colunaAcoes = document.createElement("td");

            // Botão Alterar
            const btnAlterar = document.createElement("button");
            btnAlterar.textContent = "Alterar";
            btnAlterar.className = "btn-acao btn-alterar";
            btnAlterar.onclick = () => alterarUsuario(usuario.id); // Prepara para a próxima tela

            // Botão Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.className = "btn-acao btn-excluir";
            btnExcluir.onclick = () => excluirUsuario(usuario.id);

            colunaAcoes.appendChild(btnAlterar);
            colunaAcoes.appendChild(btnExcluir);

            linha.appendChild(colunaId);
            linha.appendChild(colunaNome);
            linha.appendChild(colunaEmail);

            listaUsuarios.appendChild(linha);
        });
    } 
    catch (erro) {
        mensagem.textContent = "Não foi possível conectar com a API.";
        console.error(erro);
    }

}
// Novas Funções de Ação
function alterarUsuario(id) {
    // Redireciona para a página de edição 
    // Passando o ID via URL
    console.log("Preparando para alterar o usuário ID:", id);
    // window.location.href = `editar.html?id=${id}`; 
}

async function excluirUsuario(id) {
    // Confirmação para evitar exclusão por acidente
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/usuario/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (resposta.status === 401) {
            sair();
            return;
        }

        if (resposta.ok) {
            alert("Usuário excluído com sucesso!");
            consultarUsuarios(); // Recarrega a tabela para remover o usuário da tela
        } else {
            const dados = await resposta.json();
            alert(dados.mensagem || "Erro ao excluir o usuário.");
        }
    } catch (erro) {
        console.error("Erro na exclusão:", erro);
        alert("Não foi possível conectar com a API para exclusão.");
    }
}

// Logout
function sair() {
    localStorage.removeItem("token");
    window.location.href = "../login";
}

consultarUsuarios();