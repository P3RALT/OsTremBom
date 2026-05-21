window.addEventListener('DOMContentLoaded', async () => {
    const editProfile = document.getElementById("edit-profile");
    const paramsPerfil = new URLSearchParams(window.location.search).get('usuario');
    
    // Guardamos os dados do usuário em uma variável
    let usuarioAtual = null; 

    if (paramsPerfil && paramsPerfil.trim() !== "") {
        try {
            const resposta = await fetch(`/api/usuario/${encodeURIComponent(paramsPerfil)}`);
            if (resposta.ok) {
                usuarioAtual = await resposta.json();
                renderizarPerfil(usuarioAtual, usuarioAtual.isOwner);
            } else {
                console.error("Usuário não encontrado na API.");
            }
        } catch (e) {
            console.error("Erro ao carregar perfil:", e);
        }
    } else {
        try {
            const resposta = await fetch('/api/usuario?logado=true');
            if (resposta.ok) {
                usuarioAtual = await resposta.json();
                renderizarPerfil(usuarioAtual, true);
            } else {
                window.location.href = "/page/login.html";
            }
        } catch (error) {
            console.error("Erro ao verificar usuário logado:", error);
        }
    }

    function renderizarPerfil(usuario, isOwner) {
        const elemento = {
            seguidores: document.getElementById("seguidores"),
            seguindo: document.getElementById("seguindo"),
            nickname: document.getElementById("nickname"),
            descricaoBio: document.getElementById("descricao-bio"),
            fotoPerfil: document.getElementById("foto-perfil-usuario"),
        };

        if (elemento.seguidores) elemento.seguidores.textContent = usuario.seguidores || 0;
        if (elemento.seguindo) elemento.seguindo.textContent = usuario.seguindo || 0;
        if (elemento.nickname) elemento.nickname.textContent = usuario.nickname || "Usuário sem nickname";
        if (elemento.descricaoBio) elemento.descricaoBio.textContent = usuario.descricaoBio || "Nenhuma descrição disponível.";
        
        if (isOwner) {
            editProfile.innerHTML = `<button class="btn-edit" id="edit">Editar perfil</button>`;
        } else {
            if (usuario.segue){
                editProfile.innerHTML = `<button class="btn-edit" id="unfollow">Deixar de seguir</button>`;
            }else{
                editProfile.innerHTML = `<button class="btn-edit" id="follow">Seguir</button>`;
            }
        }
        
        if (elemento.fotoPerfil) {
            elemento.fotoPerfil.src = usuario.fotoPerfilUrl || "../img/default-profile.png";
        }
    }

    if (editProfile) {
        editProfile.addEventListener('click', async (event) => {
            const target = event.target;
            const seguidoresElement = document.getElementById("seguidores");
            // Se o clique foi no botão de Editar
            if (target.id === 'edit') {
            }

            // Se o clique foi no botão de Seguir
            if (target.id === 'follow' || target.id == "unfollow") {
                target.disabled = true; // Desabilita para evitar múltiplos cliques
                try {

                    if (target.id == "unfollow"){
                        // Lógica do unfollow
                        const resposta = await fetch(`/api/usuario/unfollow/${encodeURIComponent(usuarioAtual.nickname)}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (resposta.ok) {
                        editProfile.innerHTML = `<button class="btn-edit" id="follow">Seguir</button>`;
                        const textoAtual = seguidoresElement.textContent.trim().toLowerCase();
                        if (!textoAtual.includes('k')) {
                            let contagemAtual = parseInt(textoAtual) || 0;
                            contagemAtual -= 1;
                            
                            // Se a soma bateu exatamente 1000, você já pode travar em "1k"
                            if (contagemAtual === 1000) {
                                seguidoresElement.textContent = "999";
                            } else {
                                seguidoresElement.textContent = contagemAtual;
                            }
                        }
                    }
                    }else{
                    const resposta = await fetch(`/api/usuario/seguir/${encodeURIComponent(usuarioAtual.nickname)}`, {
                        method: 'POST',
                        credentials: 'include' // <-- Garante que o cookie com o JWT será enviado para a API
                    });
                    if (resposta.ok) {
                        // Limpa o botão ou muda o texto para "Seguindo"
                        editProfile.innerHTML = `<button class="btn-edit" id="unfollow">Deixar de seguir</button>`;
                        const textoAtual = seguidoresElement.textContent.trim().toLowerCase();
        
                        // Só faz a soma se NÃO tiver a letra "k" no texto
                        if (!textoAtual.includes('k')) {
                            let contagemAtual = parseInt(textoAtual) || 0;
                            contagemAtual += 1;
                            
                            // Se a soma bateu exatamente 1000, você já pode travar em "1k"
                            if (contagemAtual === 1000) {
                                seguidoresElement.textContent = "1k";
                            } else {
                                seguidoresElement.textContent = contagemAtual;
                            }
                        }
                    } 
                }} catch (e) {
                    console.error("Erro na requisição:", e);
                }finally{
                    target.disabled = false;
                }
            }
        });
    }
});