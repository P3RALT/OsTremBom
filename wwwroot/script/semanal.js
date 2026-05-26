// ==========================================
// VARIÁVEIS DE CONTROLE GLOBAL DO GRUPO
// ==========================================
let membrosSelecionadosGlobal = []; // Armazena os IDs/Nomes dos membros convidados
let seguidoresDoBancoGlobal = [];   // Armazena a lista de seguidores carregada pelo GET
let locaisDoBancoGlobal = [];       // Armazena os locais vindos do banco de dados temporariamente
// Mude temporariamente para testar a tela de aviso:
seguidoresDoBancoGlobal = [];

// Função para abrir o modal de criação de grupo
function abrirModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.add('active');
    }
}

// Função para fechar o modal e resetar todos os estados
function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo').reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
        
        // Limpa as variáveis de controle global para a próxima criação
        membrosSelecionadosGlobal = [];
        document.getElementById('grupoLocalSelecionadoId').value = "";
        
        // Reseta as labels dos botões de recursos
        document.getElementById('texto-local-vinculado').innerText = "Vincular Local";
        document.getElementById('texto-local-vinculado').style.fontWeight = '400';
        document.getElementById('texto-membros-vinculados').innerText = "Adicionar Membros";
        document.getElementById('texto-membros-vinculados').style.fontWeight = '400';
    }
}

// Monitora o select de privacidade para exibir ou ocultar a senha
function tratarMudancaPrivacidade() {
    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    const containerSenha = document.getElementById('container-senha-grupo');
    const inputSenha = document.getElementById('grupoSenha');

    if (selectPrivacidade.value === 'privado') {
        containerSenha.style.display = 'block';
        inputSenha.setAttribute('required', 'required');
    } else {
        containerSenha.style.display = 'none';
        inputSenha.removeAttribute('required');
        inputSenha.value = '';
    }
}

// ==========================================
// LÓGICA DO SUB-MODAL DE SELEÇÃO DE MEMBROS
// ==========================================

// Abre o sub-modal de membros
async function abrirSubModalMembros() {
    const limiteMembrosInput = document.getElementById("grupoLimite").value;
    const limiteMaximo = parseInt(limiteMembrosInput);

    // Validação de limite obrigatório antes de abrir os amigos
    if (!limiteMembrosInput || standsNaN(limiteMaximo) || limiteMaximo < 2) {
        alert("Por favor, digite um 'Limite de Membros' válido (mínimo 2) antes de adicionar pessoas.");
        document.getElementById("grupoLimite").focus();
        return;
    }

    const subModal = document.getElementById('subModalMembros');
    if (subModal) {
        subModal.classList.add('active');
        
        // Evita chamadas repetidas desnecessárias à API caso os dados já existam
        if (seguidoresDoBancoGlobal.length === 0) {
            await carregarSeguidoresParaVinculo();
        }
        renderizarListaMembrosModal(seguidoresDoBancoGlobal, limiteMaximo);
    }
}

// Fecha o sub-modal de membros
function fecharSubModalMembros() {
    const subModal = document.getElementById('subModalMembros');
    if (subModal) {
        subModal.classList.remove('active');
    }
}

// Faz o fetch GET na sua Controller C# para buscar quem o usuário segue
async function carregarSeguidoresParaVinculo() {
    try {
        const resposta = await fetch('http://localhost:5207/api/Usuarios/Seguindo');
        if (!resposta.ok) throw new Error();
        seguidoresDoBancoGlobal = await resposta.json();
    } catch (erro) {
        console.warn("API Offline. Carregando dados simulados de seguidores.");
        // Fallback ativo se a API estiver desligada
        // TESTE: Mude o array abaixo para vazio [] para testar a mensagem de aviso na tela!
       
    }
}

// Renderiza os membros em caixas ovais pretas com Checkbox
// SUBSTITUA APENAS ESTA FUNÇÃO NO SEU SCRIPT ORIGINAL:
function renderizarListaMembrosModal(lista, limiteMaximo) {
    const listaContainer = document.getElementById('lista-membros-dinamica');
    
    // Se o contêiner não existir na tela, tenta usar o outro ID do seu HTML
    const containerReal = listaContainer || document.getElementById('lista-membros-dinamica-modal');
    
    if (!containerReal) return; // Proteção para não travar o código se o ID não for encontrado
    
    containerReal.innerHTML = "";

    // SE A LISTA ESTIVER VAZIA: Mostra o aviso amigável sem quebrar o layout
    if (lista.length === 0) {
        containerReal.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; color: #718096; font-family: 'Inter', sans-serif;">
                <i class="fa-solid fa-user-slash" style="font-size: 24px; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p style="font-size: 14px; font-weight: 600; margin: 0;">Nenhum seguidor encontrado.</p>
            </div>
        `;
        return;
    }

    // Se houver seguidores, desenha as caixas normalmente
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

// Controla as entradas e saídas do array validando o teto máximo
function alternarMembroDoGrupo(seguidor, limiteMaximo, checkboxElement) {
    const index = membrosSelecionadosGlobal.findIndex(m => m.id === seguidor.id);
    
    if (checkboxElement.checked) {
        // REGRA DO LIMITE: Valida se convites ultrapassam o teto definido no input
        if (membrosSelecionadosGlobal.length + 1 >= limiteMaximo) {
            alert(`Ação bloqueada! O limite configurado para este grupo é de apenas ${limiteMaximo} membros.`);
            checkboxElement.checked = false; // Desmarca visualmente
            return;
        }
        if (index === -1) membrosSelecionadosGlobal.push(seguidor);
    } else {
        if (index > -1) membrosSelecionadosGlobal.splice(index, 1);
    }

    // Atualiza o texto dinâmico do botão principal
    const textoBotao = document.getElementById('texto-membros-vinculados');
    if (membrosSelecionadosGlobal.length > 0) {
        textoBotao.innerText = `Membros: (${membrosSelecionadosGlobal.length}) Selecionados`;
        textoBotao.style.fontWeight = '700';
    } else {
        textoBotao.innerText = "Adicionar Membros";
        textoBotao.style.fontWeight = '400';
    }
}

// ==========================================
// SALVAMENTO NO BANCO DE DADOS (POST API)
// ==========================================
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
        const resposta = await fetch('http://localhost:5207/api/Grupos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosGrupo)
        });

        if (!resposta.ok) throw new Error("Erro ao salvar o grupo no servidor.");

        alert('Grupo criado e salvo com sucesso no banco de dados!');
        fecharModalGrupo();

    } catch (erro) {
        console.error("Falha na conexão com o Banco de Dados:", erro);
        alert('Erro ao persistir os dados do grupo no banco. Verifique se o backend está ativo.');
    }
}

// ==========================================
// FUNÇÕES DE LOCAIS (CULTURA, PARQUES, ETC.)
// ==========================================
function obterIconePorCategoria(categoria) {
    if (!categoria) return 'fa-solid fa-location-dot'; 
    const cat = categoria.toLowerCase();
    if (cat.includes('gastronomia') || cat.includes('alimentação') || cat.includes('mercado')) return 'fa-solid fa-cart-shopping'; 
    if (cat.includes('bar') || cat.includes('noite') || cat.includes('bebida')) return 'fa-solid fa-glass-martini-alt'; 
    if (cat.includes('parque') || cat.includes('natureza')) return 'fa-solid fa-tree';
    if (cat.includes('cultura') || cat.includes('arte') || cat.includes('arquitetura')) return 'fa-solid fa-landmark';
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
    if (subModal) {
        subModal.classList.remove('active');
    }
}

async function carregarLocaisParaVinculo() {
    const listaContainer = document.getElementById('lista-locais-dinamica');
    listaContainer.innerHTML = "<p style='color:#718096; font-size:13px; text-align:center;'>Carregando locais de BH...</p>";

    try {
        const resposta = await fetch('http://localhost:5207/api/Locais');
        if (!resposta.ok) throw new Error();
        const locais = await resposta.json();
        locaisDoBancoGlobal = locais; 
        renderizarListaLocais(locais);
    } catch {
    
        locaisDoBancoGlobal = locaisFallback;
        renderizarListaLocais(locaisFallback);
    }
}

function renderizarListaLocais(lista) {
    const listaContainer = document.getElementById('lista-locais-dinamica');
    listaContainer.innerHTML = "";

    if (lista.length === 0) {
        listaContainer.innerHTML = "<p style='color:#718096; font-size:13px; text-align:center;'>Nenhum local encontrado.</p>";
        return;
    }

    lista.forEach(local => {
        const iconeClass = obterIconePorCategoria(local.categoria);
        const divLinha = document.createElement('div');
        divLinha.className = 'item-local-linha';
        divLinha.onclick = () => selecionarLocalParaGrupo(local.id, local.nome);

        divLinha.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px;">
                <i class="${iconeClass}"></i>
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
    document.getElementById('texto-local-vinculado').innerText = `Local: ${nome}`;
    document.getElementById('texto-local-vinculado').style.fontWeight = '700';
    fecharSubModalLocais();
}

function standsNaN(val) {
    return Number.isNaN(val);
}