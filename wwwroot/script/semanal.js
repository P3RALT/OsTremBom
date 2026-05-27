/**
 * PROPÓSITO DO SCRIPT: semanal.js
 * Gerencia a lógica operacional de criação, edição dinâmica e listagem de grupos do SQLite.
 */

// Arrays e Estados Globais
let membrosSelecionadosGlobal = []; 
let seguidoresDoBancoGlobal = [];   
let locaisDoBancoGlobal = [];       
let gruposDoBancoGlobal = []; 
let imagemBase64Global = null; 

// Controles de Edição
let modoEdicaoGlobal = false;
let idGrupoEditandoGlobal = null;
const ID_USUARIO_LOGADO = 1; // ID do Usuário Logado simulado

document.addEventListener("DOMContentLoaded", () => {
    carregarGruposDoBanco();

    const inputImagem = document.getElementById("grupoImagem");
    const labelNomeArquivo = document.getElementById("nome-arquivo-selecionado");

    if (inputImagem && labelNomeArquivo) {
        inputImagem.addEventListener("change", (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const arquivo = e.target.files[0];
                labelNomeArquivo.innerText = `📂 Arquivo: ${arquivo.name}`;
                
                const reader = new FileReader();
                reader.onload = (event) => { imagemBase64Global = event.target.result; };
                reader.onerror = (erro) => { console.error("Erro ao ler imagem:", erro); };
                reader.readAsDataURL(arquivo);
            } else {
                labelNomeArquivo.innerText = "";
                imagemBase64Global = null;
            }
        });
    }

    const formCriarGrupo = document.getElementById('formCriarGrupo');
    if (formCriarGrupo) formCriarGrupo.addEventListener('submit', salvarGrupo);

    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    if (selectPrivacidade) selectPrivacidade.addEventListener('change', tratarMudancaPrivacidade);

    const inputPesqGrupo = document.getElementById('input-pesquisa-grupo');
    if (inputPesqGrupo) inputPesqGrupo.addEventListener('input', filtrarGrupos);

    const inputPesqLocal = document.getElementById('input-pesquisa-local');
    if (inputPesqLocal) inputPesqLocal.addEventListener('input', filtrarLocaisLista);
});

// ABRE MODAL ZERADO (CRIAR)
function abrirModalGrupo() {
    modoEdicaoGlobal = false;
    idGrupoEditandoGlobal = null;
    imagemBase64Global = null;
    
    document.querySelector("#modalCriarGrupo h2").innerText = "Criar Novo Grupo de Encontro";
    document.getElementById("btnCriarGrupoSubmit").innerText = "Confirmar Criação";

    const modal = document.getElementById('modalCriarGrupo');
    if (modal) modal.classList.add('active');
}

// ABRE MODAL PREENCHIDO (EDITAR)
function abrirModalParaEdicao(idGrupo) {
    const grupo = gruposDoBancoGlobal.find(g => g.id === idGrupo);
    if (!grupo) return;

    modoEdicaoGlobal = true;
    idGrupoEditandoGlobal = idGrupo;
    imagemBase64Global = grupo.imagemUrl || null;

    document.querySelector("#modalCriarGrupo h2").innerText = "Editar Configurações do Grupo";
    document.getElementById("btnCriarGrupoSubmit").innerText = "Salvar Alterações";

    document.getElementById('grupoNome').value = grupo.nome || "";
    document.getElementById('grupoDescricao').value = grupo.descricao || "";
    document.getElementById('grupoLimite').value = grupo.limiteMembros || "";
    document.getElementById('grupoPrivacidade').value = grupo.privacidade?.toLowerCase() === "privado" ? "privado" : "publico";
    
    tratarMudancaPrivacidade();
    if (grupo.privacidade?.toLowerCase() === "privado") {
        document.getElementById('grupoSenha').value = grupo.senha || "";
    }

    if (grupo.localId) {
        document.getElementById('grupoLocalSelecionadoId').value = grupo.localId;
        atualizarElementoTexto('texto-local-vinculado', `Local: ${grupo.local?.nome || 'Vinculado'}`, '700');
    }

    const labelArquivo = document.getElementById("nome-arquivo-selecionado");
    if (labelArquivo && grupo.imagemUrl) {
        labelArquivo.innerText = "📂 O grupo já possui uma foto de capa.";
    }

    // GARANTIA EM EDIÇÃO: Força a conversão do ID mapeado para Inteiro puro
    if (grupo.membros) {
        membrosSelecionadosGlobal = grupo.membros.map(m => ({ 
            id: parseInt(m.usuarioId), 
            nome: `Membro ID ${m.usuarioId}` 
        })).filter(m => !isNaN(m.id));
        
        atualizarElementoTexto('texto-membros-vinculados', `Membros: (${membrosSelecionadosGlobal.length})`, '700');
    }

    const modal = document.getElementById('modalCriarGrupo');
    if (modal) modal.classList.add('active');
}

function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo')?.reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
        
        membrosSelecionadosGlobal = [];
        imagemBase64Global = null;
        document.getElementById('grupoLocalSelecionadoId').value = "";
        
        atualizarElementoTexto('texto-local-vinculado', 'Vincular Local', '400');
        atualizarElementoTexto('texto-membros-vinculados', 'Adicionar Membros', '400');
        atualizarElementoTexto('nome-arquivo-selecionado', '', '400');
    }
}

function fecharModalDetalhesGrupo() {
    document.getElementById('modalDetalhesGrupo')?.classList.remove('active');
}

function atualizarElementoTexto(id, texto, fontWeight) {
    const el = document.getElementById(id);
    if (el) { el.innerText = texto; el.style.fontWeight = fontWeight; }
}

async function carregarGruposDoBanco() {
    try {
        const response = await fetch('/api/Grupos');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        gruposDoBancoGlobal = await response.json();
        renderizarGrupos(gruposDoBancoGlobal);
    } catch (erro) {
        gruposDoBancoGlobal = [];
        renderizarGrupos(gruposDoBancoGlobal);
    }
}

function renderizarGrupos(lista) {
    const container = document.getElementById('grupos-container');
    if (!container) return;
    container.innerHTML = "";

    if (!lista || lista.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: #a0aec0;"><i class="fa-solid fa-people-group" style="font-size: 48px; margin-bottom: 10px;"></i><p>Nenhum grupo ativo.</p></div>`;
        return;
    }

    lista.forEach(grupo => {
        const totalMembros = grupo.membros ? grupo.membros.length : 0;
        const ePrivado = grupo.privacidade?.toLowerCase() === "privado";
        const nomeLocal = grupo.local ? grupo.local.nome : "A Combinar";
        const categoryLocal = grupo.local ? grupo.local.categoria : "Rolê";
        const fotoCapa = grupo.imagemUrl || "https://images.unsplash.com/photo-1620987278429-ca1745549794?w=500"; 
        
        const eCriador = (grupo.criadorId === ID_USUARIO_LOGADO || grupo.criadorId === 0);
        const souMembro = eCriador || (grupo.membros && grupo.membros.some(m => m.usuarioId === ID_USUARIO_LOGADO));

        const item = document.createElement('div');
        item.className = 'trem-lista-item'; 
        item.innerHTML = `
            <div class="trem-lista-avatar-wrapper">
                <img src="${fotoCapa}" alt="${grupo.nome}" class="trem-lista-img" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'">
                <div class="trem-lista-privacidade-badge">
                    <i class="${ePrivado ? 'fa-solid fa-lock' : 'fa-solid fa-users'}"></i>
                </div>
            </div>
            <div class="trem-lista-info">
                <div class="trem-lista-header-row">
                    <h3 class="trem-lista-name">${grupo.nome}</h3>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        ${eCriador ? `
                            <button class="btn-config-grupo" onclick="event.stopPropagation(); abrirModalParaEdicao(${grupo.id})" title="Editar Grupo">
                                <i class="fa-solid fa-gear"></i>
                            </button>
                            <button class="btn-config-grupo" style="background-color: #ff4757; color: white;" onclick="event.stopPropagation(); excluirGrupo(${grupo.id})" title="Excluir Grupo">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                        <span class="trem-lista-badge-membros"><i class="fa-solid fa-user-group"></i> ${totalMembros}/${grupo.limiteMembros}</span>
                    </div>
                </div>
                <p class="trem-lista-role"><i class="fa-solid fa-location-dot"></i> ${nomeLocal} • <span style="text-transform: uppercase; font-size: 11px;">${categoryLocal}</span></p>
                <p class="trem-lista-desc">${grupo.descricao || 'Sem descrição.'}</p>
                
                ${souMembro 
                    ? `<button class="trem-lista-btn-entrar" style="background-color: #2D2E47;" onclick="abrirDetalhesGrupo(${grupo.id})">Ver Detalhes do Rolê</button>`
                    : `<button class="trem-lista-btn-entrar" onclick="entrarNoGrupo(${grupo.id}, ${ePrivado})">Entrar no Grupo</button>`
                }
            </div>
        `;
        container.appendChild(item);
    });
}

function abrirDetalhesGrupo(id) {
    const grupo = gruposDoBancoGlobal.find(g => g.id === id);
    if (!grupo) return;

    document.getElementById('detalheGrupoNome').innerText = grupo.nome;
    document.getElementById('detalheGrupoDescricao').innerText = grupo.descricao || 'Sem descrição.';
    document.getElementById('detalheGrupoPrivacidade').innerText = grupo.privacidade;
    document.getElementById('detalheGrupoMembrosQtd').innerText = grupo.membros ? grupo.membros.length : 0;
    
    const img = document.getElementById('detalheGrupoImagem');
    if (img) img.src = grupo.imagemUrl || "https://images.unsplash.com/photo-1620987278429-ca1745549794?w=500";
    
    document.getElementById('detalheLocalNome').innerText = grupo.local ? grupo.local.nome : "A combinar com a galera";
    document.getElementById('detalheLocalCategoria').innerText = grupo.local ? grupo.local.categoria : "Diversos";

    const containerBotao = document.getElementById('container-botao-detalhe');
    if (containerBotao) {
        const eCriador = (grupo.criadorId === ID_USUARIO_LOGADO || grupo.criadorId === 0);
        const souMembro = eCriador || (grupo.membros && grupo.membros.some(m => m.usuarioId === ID_USUARIO_LOGADO));
        const ePrivado = grupo.privacidade?.toLowerCase() === "privado";

        if (souMembro) {
            containerBotao.innerHTML = `
                <button class="trem-lista-btn-entrar" style="background-color: #2D2E47; width: 100%; cursor: default; padding: 12px;" disabled>
                    <i class="fa-solid fa-circle-check" style="margin-right: 6px;"></i> Você já está neste Grupo
                </button>`;
        } else {
            containerBotao.innerHTML = `
                <button class="trem-lista-btn-entrar" style="width: 100%; padding: 12px;" onclick="entrarNoGrupo(${grupo.id}, ${ePrivado})">
                    <i class="fa-solid fa-user-plus" style="margin-right: 6px;"></i> Entrar no Grupo
                </button>`;
        }
    }

    document.getElementById('modalDetalhesGrupo')?.classList.add('active');
}

async function entrarNoGrupo(id, ePrivado) {
    let senhaDigitada = null;
    if (ePrivado) {
        senhaDigitada = prompt("Grupo privado. Digite a senha secreta de acesso:");
        if (!senhaDigitada) return;
    }

    try {
        const response = await fetch(`/api/Grupos/${id}/entrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha: senhaDigitada })
        });

        if (!response.ok) {
            const erroTxt = await response.text();
            alert(`Aviso: ${erroTxt}`);
            return;
        }

        alert("Inscrito com sucesso no grupo!");
        await carregarGruposDoBanco(); 
        abrirDetalhesGrupo(id); 

    } catch (erro) {
        alert("Erro na conexão com o servidor.");
    }
}

// =========================================================================
// SALVAR DADOS (CRIAÇÃO E EDIÇÃO) COM SANEAMENTO DE INTEIROS EXTRA SEGURO
// =========================================================================
async function salvarGrupo(event) {
    event.preventDefault();
    
    const inputLocalId = document.getElementById('grupoLocalSelecionadoId');
    const inputLimite = document.getElementById('grupoLimite');

    // CORREÇÃO CRÍTICA: Filtra o array mapeando os IDs para inteiros puros e limpando valores nulos ou falsos (NaN)
    const idsSaneados = membrosSelecionadosGlobal
        .map(m => parseInt(m.id))
        .filter(id => !isNaN(id) && id > 0);

    const dadosGrupo = {
        nome: document.getElementById('grupoNome').value,
        descricao: document.getElementById('grupoDescricao').value,
        limiteMembros: inputLimite ? parseInt(inputLimite.value) : 10,
        privacidade: document.getElementById('grupoPrivacidade').value,
        senha: document.getElementById('grupoSenha').value || null,
        localId: (inputLocalId && inputLocalId.value) ? parseInt(inputLocalId.value) : null,
        membrosIds: idsSaneados, // Envia o array limpo de inteiros puros para o C#
        imagemUrl: imagemBase64Global
    };
    
    let url = '/api/Grupos';
    let metodoHttp = 'POST';

    if (modoEdicaoGlobal && idGrupoEditandoGlobal) {
        url = `/api/Grupos/${idGrupoEditandoGlobal}`;
        metodoHttp = 'PUT';
    }
    
    try {
        const response = await fetch(url, {
            method: metodoHttp,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosGrupo)
        });

        if (!response.ok) {
            const msgErroServidor = await response.text();
            throw new Error(msgErroServidor); 
        }
        
        alert(modoEdicaoGlobal ? 'Grupo aktualizado com sucesso!' : 'Grupo criado com sucesso!');
        fecharModalGrupo();
        await carregarGruposDoBanco();
        
    } catch (erro) {
        console.error("Falha ao processar:", erro);
        alert(`FALHA: ${erro.message}`);
    }
}

async function excluirGrupo(id) {
    const confirmarExclusao = confirm("Uai! Tem certeza que deseja apagar este grupo permanentemente? Todos os membros serão removidos e essa ação não pode ser desfeita.");
    if (!confirmarExclusao) return;

    try {
        const response = await fetch(`/api/Grupos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const detalheDoErro = await response.text();
            throw new Error(detalheDoErro);
        }

        alert("Grupo excluído com sucesso uai!");
        await carregarGruposDoBanco(); 
    } catch (erro) {
        console.error("Erro ao deletar grupo:", erro);
        alert(`Não foi possível deletar o grupo: ${erro.message}`);
    }
}

function tratarMudancaPrivacidade() {
    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    const containerSenha = document.getElementById('container-senha-grupo');
    const inputSenha = document.getElementById('grupoSenha');

    if (selectPrivacidade && selectPrivacidade.value === 'privado') {
        if (containerSenha) containerSenha.style.display = 'block';
        if (inputSenha) inputSenha.setAttribute('required', 'required');
    } else {
        if (containerSenha) containerSenha.style.display = 'none';
        if (inputSenha) {
            inputSenha.removeAttribute('required');
            inputSenha.value = '';
        }
    }
}

function filtrarGrupos() {
    const input = document.getElementById('input-pesquisa-grupo');
    if (!input) return;
    
    const termo = input.value.toLowerCase();
    const filtrados = gruposDoBancoGlobal.filter(g => 
        (g.nome && g.nome.toLowerCase().includes(termo)) || 
        (g.descricao && g.descricao.toLowerCase().includes(termo))
    );
    renderizarGrupos(filtrados);
}

function filtrarLocaisLista() {
    const input = document.getElementById('input-pesquisa-local');
    if (!input) return;
    
    const termo = input.value.toLowerCase();
    const filtrados = locaisDoBancoGlobal.filter(l => (l.nome || "").toLowerCase().includes(termo));
    renderizarListaLocais(filtrados);
}

async function abrirSubModalMembros() {
    const inputLimite = document.getElementById("grupoLimite");
    const limiteMaximo = parseInt(inputLimite?.value || 0);

    if (limiteMaximo < 2) {
        alert("Digite um Limite de Membros antes.");
        return;
    }

    document.getElementById('subModalMembros')?.classList.add('active');
    if (seguidoresDoBancoGlobal.length === 0) await carregarSeguidoresParaVinculo();
    renderizarListaMembrosModal(seguidoresDoBancoGlobal, limiteMaximo);
}

function fecharSubModalMembros() { document.getElementById('subModalMembros')?.classList.remove('active'); }

// =========================================================================
// MAPEAMENTO SEGURO DE ORIGEM DOS SEGUIDORES
// =========================================================================
async function carregarSeguidoresParaVinculo() {
    try {
        const respostaUser = await fetch('/api/usuario?logado=true');
        const usuarioLogado = await respostaUser.json();
        const nickname = encodeURIComponent(usuarioLogado.nickname);
        const respostaSeguindo = await fetch(`/api/usuario/${nickname}/seguindo`);
        const dadosBrutos = await respostaSeguindo.json();
        
        // CORREÇÃO CRÍTICA: Garante a varredura de campos id/usuarioId e converte na hora para Inteiro puro
        seguidoresDoBancoGlobal = dadosBrutos.map(dado => {
            const idBruto = dado.id ?? dado.usuarioId ?? dado.Id ?? 0;
            return { 
                id: parseInt(idBruto), 
                nome: dado.nome || dado.nickname 
            };
        }).filter(s => !isNaN(s.id) && s.id > 0); // Remove falhas ou registros sem identificador válido

    } catch {
        seguidoresDoBancoGlobal = [{ id: 101, nome: "Uai Mateus" }, { id: 102, nome: "Chica da Silva" }];
    }
}

function renderizarListaMembrosModal(lista, limiteMaximo) {
    const container = document.getElementById('lista-membros-dinamica');
    if (!container) return; container.innerHTML = "";
    
    lista.forEach(seguidor => {
        const div = document.createElement('div');
        div.className = 'item-local-linha';
        const jaAdicionado = membrosSelecionadosGlobal.some(m => parseInt(m.id) === parseInt(seguidor.id));
        div.innerHTML = `<div style="display:flex; gap:14px;"><i class="fa-solid fa-user"></i><span>${seguidor.nome}</span></div><input type="checkbox" ${jaAdicionado ? 'checked' : ''}>`;
        
        const check = div.querySelector('input');
        div.onclick = () => {
            check.checked = !check.checked;
            if (check.checked && membrosSelecionadosGlobal.length + 1 >= limiteMaximo) {
                alert(`Limite de ${limiteMaximo} atingido.`);
                check.checked = false; return;
            }
            if (check.checked) membrosSelecionadosGlobal.push(seguidor);
            else membrosSelecionadosGlobal = membrosSelecionadosGlobal.filter(m => parseInt(m.id) !== parseInt(seguidor.id));
            
            atualizarElementoTexto('texto-membros-vinculados', membrosSelecionadosGlobal.length > 0 ? `Membros: (${membrosSelecionadosGlobal.length})` : "Adicionar Membros", '700');
        };
        container.appendChild(div);
    });
}

async function abrirSubModalLocais() {
    document.getElementById('subModalLocais')?.classList.add('active');
    await carregarLocaisParaVinculo();
}

function fecharSubModalLocais() { document.getElementById('subModalLocais')?.classList.remove('active'); }

async function carregarLocaisParaVinculo() {
    try {
        const resposta = await fetch('/api/Locais');
        locaisDoBancoGlobal = await resposta.json(); 
        renderizarListaLocais(locaisDoBancoGlobal);
    } catch {
        locaisDoBancoGlobal = [{ id: 110, nome: "Forno da Saudade", categoria: "bar" }];
        renderizarListaLocais(locaisDoBancoGlobal);
    }
}

function renderizarListaLocais(lista) {
    const container = document.getElementById('lista-locais-dinamica');
    if (!container) return; container.innerHTML = "";
    lista.forEach(local => {
        const div = document.createElement('div');
        div.className = 'item-local-linha';
        div.innerHTML = `<div><i class="fa-solid fa-location-dot"></i> <span>${local.nome}</span></div>`;
        div.onclick = () => {
            document.getElementById('grupoLocalSelecionadoId').value = local.id;
            atualizarElementoTexto('texto-local-vinculado', `Local: ${local.nome}`, '700');
            fecharSubModalLocais();
        };
        container.appendChild(div);
    });
}

// Vincula as funções necessárias globalmente ao escopo window
window.excluirGrupo = excluirGrupo;