/**
 * DOCUMENTAÇÃO DO SCRIPT: perfilBuilder.js
 * Este script gerencia o carregamento dinâmico dos dados do perfil, o controle
 * de relacionamentos (seguir/deixar de seguir) e as operações do modal de edição.
 */

let usuarioAtual = null;

window.addEventListener('DOMContentLoaded', async () => {
    const editProfile = document.getElementById("edit-profile");
    const paramsPerfil = new URLSearchParams(window.location.search).get('usuario');

    const elemento = {
        seguidores: document.getElementById("seguidores"),
        seguindo: document.getElementById("seguindo"),
        nickname: document.getElementById("nickname"),
        descricaoBio: document.getElementById("descricao-bio"),
        fotoPerfil: document.querySelector("#foto-perfil-usuario img"),
        preferencias: document.getElementById("preferencias"),
        publicacoesElement: document.getElementById("total-publicacoes")
    };

    const tabs = document.querySelectorAll('#tabs-items .tab-item');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (index === 0) {
                if (usuarioAtual) {
                    renderizarPerfil(usuarioAtual, usuarioAtual.isOwner);
                }
            } else if (index === 1) {
                carregarCurtidas();
            } else {
                // TAB GRUPOS: Aciona a função de busca dos grupos em que o usuário está vinculado
                carregarGruposDoPerfil();
            }
        });
    });

    if (paramsPerfil && paramsPerfil.trim() !== "") {
        try {
            const resposta = await fetch(`/api/usuario/${encodeURIComponent(paramsPerfil)}`);
            if (resposta.ok) {
                usuarioAtual = await resposta.json();
                renderizarPerfil(usuarioAtual, usuarioAtual.isOwner);
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
                window.location.replace("/page/login.html");
            }
        } catch (error) {
            console.error("Erro ao verificar usuário logado:", error);
        }
    }

    function renderizarPerfil(usuario, isOwner) {
        const mainGrid = document.getElementById("main-grid");
        const publicacoes = usuario.publicacoes || [];
        document.title = `${usuario.nickname} - Os Trem de BH`;
        
        // Remove classes de grid de grupos se houver, mantendo a original do perfil
        mainGrid.className = "photo-grid";

        if (publicacoes.length > 0){
            mainGrid.innerHTML = "";
            publicacoes.forEach(post => {
                const postCard = document.createElement("div");
                postCard.classList.add("photo-item");
                
                const fotoCard = post.fotoUrl || "../img/placeholder-post.png"; 
                
                postCard.innerHTML = `
                    <img src="${fotoCard}" alt="Post">
                    <div class="photo-overlay">
                        <span><i class="fas fa-heart"></i> ${post.likes}</span>
                        <span><i class="fas fa-comment"></i> ${post.comentarios}</span>
                    </div>
                `;

                postCard.addEventListener("click", () => {
                    window.location.href = `../page/publicacao.html?id=${post.id}`;
                });
                mainGrid.appendChild(postCard);
            });
        } else {
            mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px;">Nenhuma publicação ainda.</p>`;
        } 

        if (elemento.seguidores) elemento.seguidores.textContent = usuario.seguidores || 0;
        if (elemento.seguindo) elemento.seguindo.textContent = usuario.seguindo || 0;
        if (elemento.nickname) elemento.nickname.textContent = usuario.nickname || "Usuário sem nickname";
        if (elemento.descricaoBio) elemento.descricaoBio.textContent = usuario.descricaoBio || "";
        if (elemento.publicacoesElement) elemento.publicacoesElement.textContent = usuario.publicacoesCount || 0;
        
        if (elemento.fotoPerfil) {
            elemento.fotoPerfil.src = usuario.fotoPerfilUrl || "../img/default-avatar.jpg";
        }

        if (elemento.preferencias && usuario.preferencias) {
            elemento.preferencias.innerHTML = usuario.preferencias
                .map(pref => `<span class="categoria-badge">${pref}</span>`)
                .join('');
        }
        
        if (isOwner) {
            editProfile.innerHTML = `<button class="btn-edit" id="edit">Editar perfil</button>`;
        } else {
            if (usuario.segue) {
                editProfile.innerHTML = `<button class="btn-edit" id="unfollow">Deixar de seguir</button>`;
            } else {
                editProfile.innerHTML = `<button class="btn-edit" id="follow">Seguir</button>`;
            }
        }
    } 

    async function carregarCurtidas() {
        const mainGrid = document.getElementById("main-grid");
        mainGrid.className = "photo-grid";
        mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px;">Carregando curtidas...</p>`;

        try {
            const resposta = await fetch(`/api/usuario/${usuarioAtual.nickname}/curtidos`);
            if (resposta.ok) {
                const curtidas = await resposta.json();
                if (curtidas.length > 0) {
                    mainGrid.innerHTML = "";
                    curtidas.forEach(post => {
                        const postCard = document.createElement("div");
                        postCard.classList.add("photo-item");
                        
                        postCard.innerHTML = `
                            <img src="${post.fotoUrlPublicacao}" alt="Post Curtido">
                            <div class="photo-overlay">
                                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                                <span><i class="fas fa-comment"></i> ${post.comentarios}</span>
                            </div>
                        `;
                        postCard.addEventListener("click", () => {
                            window.location.href = `../page/publicacao.html?id=${post.id}`;
                        });
                        mainGrid.appendChild(postCard);
                    });
                } else {
                    mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px;">Nenhuma publicação encontrada.</p>`;
                }
            }
        } catch (error) {
            console.error("Erro ao buscar curtidas:", error);
        }
    }

    // --- NOVA FUNÇÃO: BUSCA E RENDERIZA OS GRUPOS DO USUÁRIO NO PERFIL ---
    async function carregarGruposDoPerfil() {
        const mainGrid = document.getElementById("main-grid");
        // Transforma dinamicamente o grid do perfil no mesmo grid de cartões da página de grupos
        mainGrid.className = "grupos-grid-container"; 
        mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px;">Buscando seus grupos, uai...</p>`;

        try {
            const resposta = await fetch(`/api/usuario/${usuarioAtual.nickname}/grupos`);
            if (resposta.ok) {
                const grupos = await resposta.json();
                if (grupos.length > 0) {
                    mainGrid.innerHTML = "";
                    grupos.forEach(grupo => {
                        const totalMembros = grupo.membros ? grupo.membros.length + 1 : 1;
                        const ePrivado = grupo.privacidade?.toLowerCase() === "privado";
                        const nomeLocal = grupo.local ? grupo.local.nome : "Belo Horizonte";
                        const fotoCapa = grupo.imagemUrl || grupo.fotoUrl || "https://images.unsplash.com/photo-1620987278429-ca1745549794?w=500";

                        const card = document.createElement('div');
                        card.className = 'Card';
                        
                        card.innerHTML = `
                            <div class="card-image">
                                <img src="${fotoCapa}" alt="${grupo.nome}">
                                <div class="btn-favorito">
                                    <i class="${ePrivado ? 'fa-solid fa-lock' : 'fa-solid fa-users'}"></i>
                                </div>
                                <span class="badge-membros-layout">${totalMembros} membros</span>
                            </div>
                            <div class="card-content">
                                <div class="card-rating">
                                    <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                </div>
                                <h3>${grupo.nome}</h3>
                                <span class="card-category">${nomeLocal}</span>
                                <button class="btn-reservar" onclick="window.location.href='/page/Groups.html'">
                                    Ver no Painel
                                </button>
                            </div>
                        `;
                        mainGrid.appendChild(card);
                    });
                } else {
                    mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px;">Você ainda não entrou em nenhum grupo.</p>`;
                }
            }
        } catch (error) {
            console.error("Erro ao buscar grupos do perfil:", error);
            mainGrid.innerHTML = `<p class="ajuda-texto" style="text-align:center; grid-column: 1/-1; padding:20px; color:red;">Erro ao conectar.</p>`;
        }
    }

    if (editProfile) {
        editProfile.addEventListener('click', async (event) => {
            const target = event.target;
            if (!usuarioAtual) return;

            if (target.id === 'edit') {
                abrirModal();
            }

            if (target.id === 'follow' || target.id === "unfollow") {
                target.disabled = true;
                try {
                    if (target.id === "unfollow") {
                        const resposta = await fetch(`/api/usuario/unfollow/${encodeURIComponent(usuarioAtual.nickname)}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (resposta.ok) {
                            editProfile.innerHTML = `<button class="btn-edit" id="follow">Seguir</button>`;
                            if (elemento.seguidores) {
                                const textoAtual = elemento.seguidores.textContent.trim().toLowerCase();
                                if (!textoAtual.includes('k')) {
                                    let contagemAtual = parseInt(textoAtual) || 0;
                                    elemento.seguidores.textContent = Math.max(0, contagemAtual - 1);
                                }
                            }
                        }
                    } else {
                        const resposta = await fetch(`/api/usuario/seguir/${encodeURIComponent(usuarioAtual.nickname)}`, {
                            method: 'POST',
                            credentials: 'include'
                        });
                        if (resposta.ok) {
                            editProfile.innerHTML = `<button class="btn-edit" id="unfollow">Deixar de seguir</button>`;
                            if (elemento.seguidores) {
                                const textoAtual = elemento.seguidores.textContent.trim().toLowerCase();
                                if (!textoAtual.includes('k')) {
                                    let contagemAtual = parseInt(textoAtual) || 0;
                                    elemento.seguidores.textContent = contagemAtual + 1;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    target.disabled = false;
                }
            }
        });
    }
});

let dadosSeguidoresBrutos = [];
let dadosSeguindoBrutos = [];

async function abrirModalLista(tipo) {
    const nicknameElemento = document.getElementById("nickname");
    const nicknamePerfil = nicknameElemento ? nicknameElemento.textContent.trim() : "";

    if (!nicknamePerfil) return;

    document.getElementById(`modal-${tipo}`).style.display = "flex";
    document.getElementById(`lista-${tipo}`).innerHTML = `<p class="ajuda-texto" style="text-align:center; padding:20px;">Carregando...</p>`;

    try {
        const resposta = await fetch(`/api/usuario/${encodeURIComponent(nicknamePerfil)}/${tipo}`);
        if (resposta.ok) {
            const dados = await resposta.json();
            if (tipo === 'seguidores') dadosSeguidoresBrutos = dados;
            else dadosSeguindoBrutos = dados;
            atualizarListaNaTela(tipo, dados);
        }
    } catch (error) {
        console.error(error);
    }
}

function atualizarListaNaTela(tipo, dados) {
    const container = document.getElementById(`lista-${tipo}`);
    if (!container || !Array.isArray(dados)) return;

    container.innerHTML = "";
    dados.forEach(dado => {
        const item = document.createElement("div");
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer;">
                <img src="${dado.fotoPerfil ?? dado.fotoPerfilUrl}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                <div><strong>${dado.nome ?? dado.nickname}</strong></div>
            </div>`;
        item.addEventListener("click", () => {
            window.location.href = `/page/profile.html?usuario=${dado.nome ?? dado.nickname}`;
        });
        container.appendChild(item);
    });
}

function fecharModalLista(idModal) {
    document.getElementById(idModal).style.display = "none";
}

let fotoBase64Temporaria = "";

function abrirModal() {
    try {
        const imgElement = document.querySelector("#foto-perfil-usuario img");
        document.getElementById("avatar-preview").src = imgElement ? imgElement.getAttribute("src") : "";
        fotoBase64Temporaria = "";

        const bioAtual = document.getElementById("descricao-bio") ? document.getElementById("descricao-bio").innerText : "";
        const textareaBio = document.getElementById("edit-bio");
        textareaBio.value = bioAtual;
        atualizarContador(textareaBio);

        const badgesNaTela = document.querySelectorAll("#preferencias .categoria-badge");
        const listaTagsAtuais = Array.from(badgesNaTela).map(b => b.innerText.trim().toLowerCase());

        document.querySelectorAll(".tag-opcao").forEach(botaoTag => {
            if (listaTagsAtuais.includes(botaoTag.innerText.trim().toLowerCase())) {
                botaoTag.classList.add("selecionada");
            } else {
                botaoTag.classList.remove("selecionada");
            }
        });

        document.getElementById("modal-editar").style.display = "flex";
    } catch (error) {
        console.error(error);
    }
}

function fecharModal() {
    document.getElementById("modal-editar").style.display = "none";
}

function toggleTagSelecao(elementoTag) {
    elementoTag.classList.toggle("selecionada");
}

function atualizarContador(textarea) {
    document.getElementById("contador-caracteres").textContent = 150 - textarea.value.length;
}

function atualizarPreviaImagem(input) {
    if (input.files && input.files[0]) {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            document.getElementById("avatar-preview").src = e.target.result;
            fotoBase64Temporaria = e.target.result;
        };
        leitor.readAsDataURL(input.files[0]);
    }
}

async function salvarPerfil(event) {
    event.preventDefault(); 
    const badgesSelecionados = document.querySelectorAll(".tag-opcao.selecionada");
    const dadosEdicao = {
        fotoPerfilUrl: fotoBase64Temporaria || null,
        descricaoBio: document.getElementById("edit-bio").value,
        preferencias: Array.from(badgesSelecionados).map(badge => badge.innerText.trim())
    };

    try {
        const response = await fetch("/api/usuario/atualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosEdicao)
        });
        if (response.ok) {
            alert("Perfil salvo com sucesso!");
            fecharModal();
            window.location.reload(); 
        }
    } catch (error) {
        console.error(error);
    }
}

window.abrirModalLista = abrirModalLista;
window.fecharModalLista = fecharModalLista;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.toggleTagSelecao = toggleTagSelecao;
window.atualizarContador = atualizarContador;
window.atualizarPreviaImagem = atualizarPreviaImagem;
window.salvarPerfil = salvarPerfil;