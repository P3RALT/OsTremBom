// Construção do perfil do usuário, buscando os dados na API e renderizando na página
window.addEventListener('DOMContentLoaded', async () => {
    const paramsPerfil = new URLSearchParams(window.location.search).get('usuario');

    if (paramsPerfil && paramsPerfil.trim() !== "") {
        // Existe um usuário específico na URL (?usuario=nome)
        try {
            const resposta = await fetch(`/api/usuario/${encodeURIComponent(paramsPerfil)}`);
            if (resposta.ok) {
                const usuario = await resposta.json();
                renderizarPerfil(usuario, usuario.isOwner);
            } else {
                console.error("Usuário não encontrado na API.");
            }
        } catch (e) {
            console.error("Erro ao carregar perfil:", e);
        }
    } else {
        // Não há parâmetro na URL, busca o usuário logado (Antes era a apiCall que não rodava)
        try {
            const resposta = await fetch('/api/usuario?logado=true');
            if (resposta.ok) {
                const usuarioLogado = await resposta.json();
                renderizarPerfil(usuarioLogado, true);
  
            } else {
                // Se não estiver logado, redireciona
                window.location.href = "/page/login.html";
            }
        } catch (error) {
            console.error("Erro ao verificar usuário logado:", error);
        }
    }

    // Função de renderização (mantida dentro do escopo do DOMContentLoaded para segurança dos elementos)
    function renderizarPerfil(usuario, isOwner) {
        const elemento = {
            seguidores: document.getElementById("seguidores"),
            seguindo: document.getElementById("seguindo"),
            nickname: document.getElementById("nickname"),
            preferencias: document.getElementById("preferencias"),
            descricaoBio: document.getElementById("descricao-bio"),
            fotoPerfil: document.getElementById("foto-perfil-usuario"),
        };

        // Verifica se os elementos realmente existem no HTML antes de injetar o texto (evita erros de 'null')
        elemento.seguidores.textContent = usuario.seguidores || 0;
        elemento.seguindo.textContent = usuario.seguindo || 0;
        if (elemento.nickname) elemento.nickname.textContent = usuario.nickname || "Usuário sem nickname";
        console.log(usuario)
        if (elemento.descricaoBio) elemento.descricaoBio.textContent = usuario.descricaoBio || "Nenhuma descrição disponível.";
        if (isOwner){
            const editProfile = document.getElementById("edit-profile");
            editProfile.innerHTML = `<button class="btn-edit">Editar perfil</button>`
        }
        
        if (elemento.fotoPerfil) {
            if (usuario.fotoPerfilUrl) {
                elemento.fotoPerfil.src = usuario.fotoPerfilUrl;
            } else {
                elemento.fotoPerfil.src = "../img/default-profile.png";
            }
        }
    }
});