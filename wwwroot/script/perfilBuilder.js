/**
 * DOCUMENTAÇÃO DO SCRIPT: perfilBuilder.js
 * Este script gerencia o carregamento dinâmico dos dados do perfil, o controle
 * de relacionamentos (seguir/deixar de seguir) e as operações do modal de edição.
 */

// Variável global para armazenar os dados consolidados do usuário retornados pela API
let usuarioAtual = null;

/**
 * Aguarda o carregamento completo do documento HTML (DOM) antes de realizar
 * as requisições iniciais e montar os componentes da tela.
 */
window.addEventListener('DOMContentLoaded', async () => {
    const editProfile = document.getElementById("edit-profile");
    // Captura o parâmetro '?usuario=nome' presente na URL da página
    const paramsPerfil = new URLSearchParams(window.location.search).get('usuario');

    // VERIFICAÇÃO 1: Se existir um parâmetro de usuário na URL, busca o perfil público dele
    if (paramsPerfil && paramsPerfil.trim() !== "") {
        try {
            const resposta = await fetch(`/api/usuario/${encodeURIComponent(paramsPerfil)}`);
            if (resposta.ok) {
                usuarioAtual = await resposta.json();
                // Renderiza o perfil definindo a flag isOwner baseada na resposta da API
                renderizarPerfil(usuarioAtual, usuarioAtual.isOwner);
            } else {
                console.error("Usuário não encontrado na API.");
            }
        } catch (e) {
            console.error("Erro ao carregar perfil:", e);
        }
    } 
    // VERIFICAÇÃO 2: Se não houver parâmetro na URL, assume que está acessando o próprio perfil logado
    else {
        try {
            const resposta = await fetch('/api/usuario?logado=true');
            if (resposta.ok) {
                usuarioAtual = await resposta.json();
                // Sendo o perfil do usuário logado, a flag isOwner é forçada como true
                renderizarPerfil(usuarioAtual, true);
            } else {
                // Se não estiver logado e tentar acessar o perfil próprio, redireciona para o login
                window.location.href = "/page/login.html";
            }
        } catch (error) {
            console.error("Erro ao verificar usuário logado:", error);
        }
    }

    /**
     * Injeta os dados do usuário do banco de dados nos respectivos elementos HTML.
     * @param {Object} usuario - Objeto contendo as informações vindas da API.
     * @param {Boolean} isOwner - Identifica se o usuário visualizando é o dono do perfil.
     */
    function renderizarPerfil(usuario, isOwner) {
        // Mapeamento dos elementos estruturais da página
        const elemento = {
            seguidores: document.getElementById("seguidores"),
            seguindo: document.getElementById("seguindo"),
            nickname: document.getElementById("nickname"),
            descricaoBio: document.getElementById("descricao-bio"),
            fotoPerfil: document.querySelector("#foto-perfil-usuario img"),
            preferencias: document.getElementById("preferencias")
        };

        // Atualização de textos simples com valores padrão (fallbacks) de segurança
        if (elemento.seguidores) elemento.seguidores.textContent = usuario.seguidores || 0;
        if (elemento.seguindo) elemento.seguindo.textContent = usuario.seguindo || 0;
        if (elemento.nickname) elemento.nickname.textContent = usuario.nickname || "Usuário sem nickname";
        if (elemento.descricaoBio) elemento.descricaoBio.textContent = usuario.descricaoBio || "";
        
        // Atualiza o atributo src da imagem de avatar
        if (elemento.fotoPerfil) {
            elemento.fotoPerfil.src = usuario.fotoPerfilUrl || "../img/default-avatar.jpg";
        }

        // Renderiza as badges (tags) de preferências percorrendo o array recebido da API
        if (elemento.preferencias && usuario.preferencias) {
            elemento.preferencias.innerHTML = usuario.preferencias
                .map(pref => `<span class="categoria-badge">${pref}</span>`)
                .join('');
        }
        
        // Injeção condicional dos botões de ação na div #edit-profile
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

    /**
     * Escuta todos os cliques ocorridos dentro do container #edit-profile (técnica de Event Delegation).
     * Gerencia ações dos botões "Editar", "Seguir" e "Deixar de seguir".
     */
    if (editProfile) {
        editProfile.addEventListener('click', async (event) => {
            const target = event.target;
            const seguidoresElement = document.getElementById("seguidores");
            
            // Tratamento preventivo de segurança para evitar quebras se o usuário não tiver sido carregado
            if (!usuarioAtual) return;

            // CASO 1: Clique no botão Editar perfil
            if (target.id === 'edit') {
                abrirModal();
            }

            // CASO 2: Clique em botões de relacionamento (Follow ou Unfollow)
            if (target.id === 'follow' || target.id === "unfollow") {
                target.disabled = true; // Desabilita o clique para evitar requisições duplicadas
                try {
                    // Sub-caso A: Executar Unfollow
                    if (target.id === "unfollow") {
                        const resposta = await fetch(`/api/usuario/unfollow/${encodeURIComponent(usuarioAtual.nickname)}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (resposta.ok) {
                            // Altera visualmente o botão para Seguir
                            editProfile.innerHTML = `<button class="btn-edit" id="follow">Seguir</button>`;
                            const textoAtual = seguidoresElement.textContent.trim().toLowerCase();
                            // Se a contagem não estiver abreviada (ex: 15.4k), atualiza o número em tempo real (-1)
                            if (!textoAtual.includes('k')) {
                                let contagemAtual = parseInt(textoAtual) || 0;
                                contagemAtual = Math.max(0, contagemAtual - 1); // Evita números negativos
                                seguidoresElement.textContent = contagemAtual;
                            }
                        }
                    } 
                    // Sub-caso B: Executar Follow
                    else {
                        const resposta = await fetch(`/api/usuario/seguir/${encodeURIComponent(usuarioAtual.nickname)}`, {
                            method: 'POST',
                            credentials: 'include'
                        });
                        if (resposta.ok) {
                            // Altera visualmente o botão para Deixar de Seguir
                            editProfile.innerHTML = `<button class="btn-edit" id="unfollow">Deixar de seguir</button>`;
                            const textoAtual = seguidoresElement.textContent.trim().toLowerCase();
                            // Se a contagem não estiver abreviada, atualiza o número em tempo real (+1)
                            if (!textoAtual.includes('k')) {
                                let contagemAtual = parseInt(textoAtual) || 0;
                                contagemAtual += 1;
                                seguidoresElement.textContent = contagemAtual;
                            }
                        }
                    }
                } catch (e) {
                    console.error("Erro na requisição de relacionamento:", e);
                } finally {
                    target.disabled = false; // Devolve o controle do botão ao usuário
                }
            }
        });
    }
});

/**
 * =========================================================================
 * FUNÇÕES DE CONTROLE DO MODAL (Exportadas para o escopo global Window)
 * =========================================================================
*/
// Armazenará temporariamente a string da imagem em Base64
let fotoBase64Temporaria = "";

/**
 * Captura as informações renderizadas na interface e popula o formulário
 * interativo do modal antes de exibi-lo.
 */
function abrirModal() {
    try {
        // 1. Coleta e define a foto atual na prévia
        const imgElement = document.querySelector("#foto-perfil-usuario img");
        const fotoAtual = imgElement ? imgElement.getAttribute("src") : "";
        document.getElementById("avatar-preview").src = fotoAtual;
        fotoBase64Temporaria = ""; // Reseta o upload temporário

        // 2. Coleta a biografia e configura o textarea com o contador
        const bioElement = document.getElementById("descricao-bio");
        const bioAtual = bioElement ? bioElement.innerText : "";
        const textareaBio = document.getElementById("edit-bio");
        textareaBio.value = bioAtual;
        atualizarContador(textareaBio); // Define o número inicial do contador de letras

        // 3. Lê as tags que o usuário já tem na tela e marca os badges como selecionados
        const badgesNaTela = document.querySelectorAll("#preferencias .categoria-badge");
        const listaTagsAtuais = Array.from(badgesNaTela).map(b => b.innerText.trim().toLowerCase());

        const opcoesTags = document.querySelectorAll(".tag-opcao");
        opcoesTags.forEach(botaoTag => {
            const textoTag = botaoTag.innerText.trim().toLowerCase();
            // Se o usuário já tiver essa tag no perfil, adiciona a classe visual de selecionada
            if (listaTagsAtuais.includes(textoTag)) {
                botaoTag.classList.add("selecionada");
            } else {
                botaoTag.classList.remove("selecionada");
            }
        });

        // Exibe o modal na tela
        document.getElementById("modal-editar").style.display = "flex";
    } catch (error) {
        console.error("Erro ao abrir modal:", error);
    }
}

/**
 * Oculta o modal de edição.
 */
function fecharModal() {
    document.getElementById("modal-editar").style.display = "none";
}

/**
 * Ativa ou desativa a classe CSS de seleção visual ao clicar em uma tag.
 * @param {HTMLElement} elementoTag - O elemento span da tag clicada.
 */
function toggleTagSelecao(elementoTag) {
    elementoTag.classList.toggle("selecionada");
}

/**
 * Calcula em tempo real quantos caracteres restam da descrição.
 * @param {HTMLTextAreaElement} textarea - O campo de texto da bio.
 */
function actualizarContador(textarea) {
    const limite = 150;
    const qtdDigitada = textarea.value.length;
    const restante = limite - qtdDigitada;
    document.getElementById("contador-caracteres").textContent = restante;
}

/**
 * Lê o arquivo de imagem selecionado pelo usuário, exibe a prévia circular 
 * na tela e converte o arquivo para Base64.
 * @param {HTMLInputElement} input - O input de arquivo oculto.
 */
function atualizarPreviaImagem(input) {
    if (input.files && input.files[0]) {
        const leitor = new FileReader();
        
        // Evento executado assim que o JavaScript terminar de ler o arquivo
        leitor.onload = function(e) {
            // Define o resultado da leitura (Base64) como src da prévia visual
            document.getElementById("avatar-preview").src = e.target.result;
            fotoBase64Temporaria = e.target.result; // Guarda o texto da imagem para enviar no formulário
        };
        
        // Executa a leitura do arquivo de imagem transformando-o em texto data URL
        leitor.readAsDataURL(input.files[0]);
    }
}

/**
 * Processa as modificações, junta as tags selecionadas e envia via PUT para a API.
 */
async function salvarPerfil(event) {
    event.preventDefault(); 

    const bioText = document.getElementById("edit-bio").value;

    // Coleta o texto de todos os badges que possuem a classe "selecionada"
    const badgesSelecionados = document.querySelectorAll(".tag-opcao.selecionada");
    const listaTags = Array.from(badgesSelecionados).map(badge => badge.innerText.trim());

    // Se o usuário escolheu uma foto nova, envia o Base64. Se não, deixa em branco (o C# manterá a antiga)
    const dadosEdicao = {
        fotoPerfilUrl: fotoBase64Temporaria || null,
        descricaoBio: bioText,
        preferencias: listaTags
    };

    try {
        const response = await fetch("/api/usuario/atualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosEdicao)
        });

        if (response.ok) {
            alert("Perfil atualizado com sucesso, uai!");
            fecharModal();
            window.location.reload(); 
        } else {
            alert("Não foi possível salvar as alterações.");
        }
    } catch (error) {
        console.error("Erro de comunicação com o servidor:", error);
    }
}

let dadosSeguidoresBrutos = [];
let dadosSeguindoBrutos = [];

/**
 * Abre o modal correspondente e aciona a busca de dados na API.
 */
async function abrirModalLista(tipo) {
    const nicknameElemento = document.getElementById("nickname");
    const nicknamePerfil = nicknameElemento ? nicknameElemento.textContent.trim() : "";

    if (!nicknamePerfil) {
        console.error("Não foi possível achar o nickname na tela.");
        return;
    }

    // CORREÇÃO: Aplica a exibição flex usando a nova classe isolada do container
    document.getElementById(`modal-${tipo}`).style.display = "flex";

    // Mostra um feedback visual de carregamento na lista correspondente
    document.getElementById(`lista-${tipo}`).innerHTML = `<p class="ajuda-texto" style="text-align:center; padding:20px;">Carregando dados, uai...</p>`;

    try {
        const resposta = await fetch(`/api/usuario/${encodeURIComponent(nicknamePerfil)}/${tipo}`);
        if (resposta.ok) {
            const dados = await resposta.json();
            
            if (tipo === 'seguidores') dadosSeguidoresBrutos = dados;
            else dadosSeguindoBrutos = dados;

            atualizarListaNaTela(tipo, dados);
        } else {
            document.getElementById(`lista-${tipo}`).innerHTML = `<p class="ajuda-texto" style="text-align:center; color:red; padding:20px;">Erro ao carregar a lista.</p>`;
        }
    } catch (error) {
        console.error("Erro na requisição da lista:", error);
    }
}

/**
 * Oculta o modal de lista limpando o display.
 */
function fecharModalLista(idModal) {
    document.getElementById(idModal).style.display = "none";
}

// Vincula as funções corrigidas ao escopo do Window do navegador
window.abrirModalLista = abrirModalLista;
window.fecharModalLista = fecharModalLista;

// Exporta as novas funções criadas para que fiquem visíveis globalmente no arquivo HTML
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.toggleTagSelecao = toggleTagSelecao;
window.atualizarContador = actualizarContador;
window.atualizarPreviaImagem = atualizarPreviaImagem;
window.salvarPerfil = salvarPerfil;
