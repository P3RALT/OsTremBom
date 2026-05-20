// Construção do perfil do usuário, buscando os dados na API e renderizando na página
window.addEventListener('DOMContentLoaded', async () => {
    const elemento = {
        nickname: document.getElementById("nickname"),
        preferencias: document.getElementById("preferencias"),
        descricaoBio: document.getElementById("descricao-bio"),
        fotoPerfil: document.getElementById("foto-perfil-usuario"),
    };

    const paramsPerfil = new URLSearchParams(window.location.search).get('usuario');

    if (paramsPerfil && paramsPerfil.trim() !== "") {
        try {
            const resposta = await fetch(`/api/usuario/${encodeURIComponent(paramsPerfil)}`);
            if (resposta.ok) {
                const dadosDoPerfil = await resposta.json();
                
                elemento.nickname.textContent = dadosDoPerfil.nickname;
                //elemento.vistoPorUltimo.textContent = dadosDoPerfil.vistoPorUltimo;
                if (elemento.preferencias && dadosDoPerfil.preferencias) {
                    elemento.preferencias.innerHTML = ""; 
                    dadosDoPerfil.preferencias.forEach(pref => {
                        // Cria um elemento de span (ou li) para cada preferência
                        const tag = document.createElement("span");
                        tag.className = "categoria-badge"; 
                        tag.textContent = pref.nome || pref; 
                        
                        // Adiciona a tag dentro do container do HTML
                        elemento.preferencias.appendChild(tag);
                    });
                }
                elemento.descricaoBio.textContent = dadosDoPerfil.descricao;
                // Renderiza a imagem injetando a tag completa
                elemento.fotoPerfil.innerHTML = `<img src="${dadosDoPerfil.fotoPerfilUrl}" alt="Foto de perfil de ${dadosDoPerfil.nickname}">`;
                
                // document.getElementById("descricao-bio").textContent = dadosDoPerfil.descricaoBio;
                // document.getElementById("data-registro").textContent = new Date(dadosDoPerfil.dataRegistro).toLocaleDateString();
            } else {
                console.error("Usuário não encontrado na API.");
            }
        } catch (e) {
            console.error("Erro ao carregar perfil:", e);
        }
    } else {
        console.warn("Nenhum parâmetro de usuário foi encontrado na URL.");
    }
});