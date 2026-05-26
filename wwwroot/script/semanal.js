/**
 * PROPÓSITO DO SCRIPT: Semanal.js
 * Gerencia a lógica operacional de criação de grupos, integrando sub-modais de seleção de 
 * amigos, filtros com barra de pesquisa para locais e consumo do webservice externo ViaCEP.
 */

// Arrays globais de gerenciamento de estado em memória
let membrosSelecionadosGlobal = []; 
let seguidoresDoBancoGlobal = [];   
let locaisDoBancoGlobal = [];       

function abrirModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) modal.classList.add('active');
}

function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo').reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
        
        membrosSelecionadosGlobal = [];
        document.getElementById('grupoLocalSelecionadoId').value = "";
        
        document.getElementById('texto-local-vinculado').innerText = "Vincular Local";
        document.getElementById('texto-local-vinculado').style.fontWeight = '400';
        document.getElementById('texto-membros-vinculados').innerText = "Adicionar Membros";
        document.getElementById('texto-membros-vinculados').style.fontWeight = '400';
    }
}

function tratarMudancaPrivacidade() {
    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    const containerSenha = document.getElementById('container-senha-grupo');
    const inputSenha = document.getElementById('grupoSenha');

    if (selectPrivacidade && selectPrivacidade.value === 'privado') {
        containerSenha.style.display = 'block';
        inputSenha.setAttribute('required', 'required');
    } else if (containerSenha) {
        containerSenha.style.display = 'none';
        inputSenha.removeAttribute('required');
        inputSenha.value = '';
    }
}

// =========================================================================
// GESTÃO DO SUB-MODAL DE CONVITE DE MEMBROS
// =========================================================================
async function abrirSubModalMembros() {
    const limiteMembrosInput = document.getElementById("grupoLimite").value;
    const limiteMaximo = parseInt(limiteMembrosInput);

    // CORREÇÃO DO BUG: Modificado de 'standsNaN' para a expressão global correta 'isNaN'
    if (!limiteMembrosInput || isNaN(limiteMaximo) || limiteMaximo < 2) {
        alert("Por favor, digite um 'Limite de Membros' válido (mínimo 2) antes de adicionar pessoas.");
        document.getElementById("grupoLimite").focus();
        return;
    }

    const subModal = document.getElementById('subModalMembros');
    if (subModal) {
        subModal.classList.add('active');
        if (seguidoresDoBancoGlobal.length === 0) {
            await carregarSeguidoresParaVinculo();
        }
        renderizarListaMembrosModal(seguidoresDoBancoGlobal, limiteMaximo);
    }
}

function fecharSubModalMembros() {
    const subModal = document.getElementById('subModalMembros');
    if (subModal) subModal.classList.remove('active');
}

async function carregarSeguidoresParaVinculo() {
    try {
        const respostaUser = await fetch('/api/usuario?logado=true');
        if (!respostaUser.ok) throw new Error();
        const usuarioLogado = await respostaUser.json();
        
        const nickname = encodeURIComponent(usuarioLogado.nickname);
        const respostaSeguindo = await fetch(`/api/usuario/${nickname}/seguindo`);
        if (!respostaSeguindo.ok) throw new Error();
        
        const dadosBrutos = await respostaSeguindo.json();
        seguidoresDoBancoGlobal = dadosBrutos.map(dado => ({
            id: dado.id,
            nome: dado.nome || dado.nickname
        }));
    } catch (erro) {
        console.warn("API offline, carregando mock de desenvolvimento local.");
        seguidoresDoBancoGlobal = [
            { id: 101, nome: "Uai Mateus" },
            { id: 102, nome: "Chica da Silva" },
            { id: 103, nome: "Trem Bão da Pampulha" }
        ];
    }
}

function renderizarListaMembrosModal(lista, limiteMaximo) {
    const containerReal = document.getElementById('lista-membros-dinamica') || document.getElementById('lista-membros-dinamica-modal');
    if (!containerReal) return; 
    containerReal.innerHTML = "";

    if (lista.length === 0) {
        containerReal.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #718096;">
                <p>Nenhum seguidor encontrado para convidar.</p>
            </div>`;
        return;
    }

    lista.forEach(seguidor => {
        const divLinha = document.createElement('div');
        divLinha.className = 'item-local-linha';
        const jaAdicionado = membrosSelecionadosGlobal.some(m => m.id === seguidor.id);

        divLinha.innerHTML = `
            <div style="display:flex; align-items:center; gap: 14px;">
                <i class="fa-solid fa-user"></i>
                <span>${seguidor.nome}</span>
            </div>
            <input type="checkbox" id="check-user-${seguidor.id}" ${jaAdicionado ? 'checked' : ''}>
        `;

        divLinha.onclick = (e) => {
            if (e.target.type !== 'checkbox') {
                const cb = divLinha.querySelector('input[type="checkbox"]');
                cb.checked = !cb.checked;
            }
            alternarMembroDoGrupo(seguidor, limiteMaximo, divLinha.querySelector('input[type="checkbox"]'));
        };
        containerReal.appendChild(divLinha);
    });
}

function alternarMembroDoGrupo(seguidor, limiteMaximo, checkboxElement) {
    const index = membrosSelecionadosGlobal.findIndex(m => m.id === seguidor.id);
    
    if (checkboxElement.checked) {
        // Valida se o grupo já bateu o limite configurado no formulário principal
        if (membrosSelecionadosGlobal.length + 1 >= limiteMaximo) {
            alert(`Ação bloqueada! O limite configurado para este grupo é de apenas ${limiteMaximo} membros.`);
            checkboxElement.checked = false; 
            return;
        }
        if (index === -1) membrosSelecionadosGlobal.push(seguidor);
    } else {
        if (index > -1) membrosSelecionadosGlobal.splice(index, 1);
    }

    const textoBotao = document.getElementById('texto-membros-vinculados');
    if (textoBotao) {
        textoBotao.innerText = membrosSelecionadosGlobal.length > 0 ? `Membros: (${membrosSelecionadosGlobal.length}) Selecionados` : "Adicionar Membros";
    }
}

// PERSISTÊNCIA: Envia os dados coletados estruturados como JSON para salvar no SQLite
async function salvarGrupo(event) {
    event.preventDefault();
    
    const dadosGrupo = {
        nome: document.getElementById('grupoNome').value,
        descricao: document.getElementById('grupoDescricao').value,
        limiteMembros: parseInt(document.getElementById('grupoLimite').value),
        privacidade: document.getElementById('grupoPrivacidade').value,
        senha: document.getElementById('grupoSenha').value || null,
        localId: document.getElementById('grupoLocalSelecionadoId').value ? parseInt(document.getElementById('grupoLocalSelecionadoId').value) : null,
        membrosIds: membrosSelecionadosGlobal.map(m => m.id) 
    };
    
    try {
        // CORREÇÃO: Removido endereço absoluto localhost:5207
        const response = await fetch('/api/Grupos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosGrupo)
        });

        if (!response.ok) throw new Error();
        alert('Grupo criado e salvo com sucesso no banco de dados!');
        fecharModalGrupo();
    } catch (erro) {
        alert('Erro ao persistir os dados do grupo no banco. Verifique se o backend está ativo.');
    }
}

// Helper utilitário para mudar o ícone de pasta com base na categoria
function obtenerIconePorCategoria(categoria) {
    if (!categoria) return 'fa-solid fa-location-dot'; 
    const cat = categoria.toLowerCase();
    if (cat.includes('gastronomia') || cat.includes('alimentação')) return 'fa-solid fa-cart-shopping'; 
    if (cat.includes('bar') || cat.includes('noite')) return 'fa-solid fa-glass-martini-alt'; 
    if (cat.includes('parque')) return 'fa-solid fa-tree';
    return 'fa-solid fa-location-dot';
}

async function abrirSubModalLocais() {
    const subModal = document.getElementById('subModalLocais');
    if (subModal) {
        subModal.classList.add('active');
        document.getElementById('input-pesquisa-local').value = "";
        await carregarLocaisParaVinculo();
    }
}

function fecharSubModalLocais() {
    const subModal = document.getElementById('subModalLocais');
    if (subModal) subModal.classList.remove('active');
}

async function carregarLocaisParaVinculo() {
    const listaContainer = document.getElementById('lista-locais-dinamica');
    if (!listaContainer) return;
    listaContainer.innerHTML = "<p style='font-size:13px; text-align:center;'>Carregando locais de BH...</p>";

    try {
        // CORREÇÃO: Removido domínio absoluto localhost:5207
        const resposta = await fetch('/api/Locais');
        if (!resposta.ok) throw new Error();
        const locais = await resposta.json();
        locaisDoBancoGlobal = locais; 
        renderizarListaLocais(locais);
    } catch {
        locaisDoBancoGlobal = [
            { id: 1, nome: "Mercado Central", categoria: "gastronomia" },
            { id: 2, nome: "Praça da Liberdade", categoria: "cultura" }
        ];
        renderizarListaLocais(locaisDoBancoGlobal);
    }
}

function renderizarListaLocais(lista) {
    const listaContainer = document.getElementById('lista-locais-dinamica');
    if (!listaContainer) return;
    listaContainer.innerHTML = "";

    lista.forEach(local => {
        const divLinha = document.createElement('div');
        divLinha.className = 'item-local-linha';
        divLinha.onclick = () => selecionarLocalParaGrupo(local.id, local.nome);

        divLinha.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px;">
                <i class="${obtenerIconePorCategoria(local.categoria)}"></i>
                <span>${local.nome}</span>
            </div>
        `;
        listaContainer.appendChild(divLinha);
    });
}

function filtrarLocaisLista() {
    const termo = document.getElementById('input-pesquisa-local').value.toLowerCase();
    const filtrados = locaisDoBancoGlobal.filter(l => l.nome.toLowerCase().includes(termo));
    renderizarListaLocais(filtrados);
}

function selecionarLocalParaGrupo(id, nome) {
    document.getElementById('grupoLocalSelecionadoId').value = id;
    const txtLocal = document.getElementById('texto-local-vinculado');
    if (txtLocal) {
        txtLocal.innerText = `Local: ${nome}`;
        txtLocal.style.fontWeight = '700';
    }
    fecharSubModalLocais();
}