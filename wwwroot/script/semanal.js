// ==========================================
// VARIÁVEIS DE CONTROLE GLOBAL DO GRUPO
// ==========================================
let membrosSelecionadosGlobal = []; // Armazena os IDs/Nomes dos membros convidados
let seguidoresDoBancoGlobal = [];   // Armazena a lista de seguidores carregada pelo GET
let locaisDoBancoGlobal = [];       // Armazena os locais vindos do banco de dados temporariamente

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

// INTEGRAÇÃO: Faz o fetch real sincronizado com o sistema de rotas do seu perfil
async function carregarSeguidoresParaVinculo() {
    try {
        // 1. Descobre quem é o usuário logado no sistema
        const respostaUser = await fetch('/api/usuario?logado=true');
        if (!respostaUser.ok) throw new Error("Usuário não logado");
        const usuarioLogado = await respostaUser.json();
        
        // 2. Bate na rota de relacionamento correta usando o nickname dinâmico
        const nickname = encodeURIComponent(usuarioLogado.nickname);
        const respostaSeguindo = await fetch(`/api/usuario/${nickname}/seguindo`);
        if (!respostaSeguindo.ok) throw new Error("Erro na rota de seguindo");
        
        // 3. Mapeia os dados recebidos para o padrão id e nome usado na renderização
        const dadosBrutos = await respostaSeguindo.json();
        seguidoresDoBancoGlobal = dadosBrutos.map(dado => ({
            id: dado.id,
            nome: dado.nome ?? dado.nickname
        }));
    } catch (erro) {
        console.warn("API Offline ou Erro de autenticação. Carregando dados simulados.", erro);
        // Fallback ativo para desenvolvimento local caso o banco falte
        seguidoresDoBancoGlobal = [
            { id: 101, nome: "Uai Mateus" },
            { id: 102, nome: "Chica da Silva" },
            { id: 103, nome: "Trem Bão da Pampulha" },
            { id: 104, nome: "Arnaldo BH" }
        ];
    }
}

// Renderiza os membros em caixas ovais com Checkbox e adiciona aviso se estiver vazia
function renderizarListaMembrosModal(lista, limiteMaximo) {
    const listaContainer = document.getElementById('lista-membros-dinamica');
    const containerReal = listaContainer || document.getElementById('lista-membros-dinamica-modal');
    
    if (!containerReal) return; 
    
    containerReal.innerHTML = "";

    // SE A LISTA ESTIVER VAZIA: Mostra o aviso amigável sem quebrar o layout do modal
    if (lista.length === 0) {
        containerReal.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; color: #718096; font-family: 'Inter', sans-serif;">
                <i class="fa-solid fa-user-slash" style="font-size: 24px; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p style="font-size: 14px; font-weight: 600; margin: 0;">Nenhum seguidor encontrado.</p>
            </div>
        `;
        return;
    }

    // Se houver seguidores, desenha as caixas ovais normalmente
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
        const response = await fetch('http://localhost:5207/api/Grupos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosGrupo)
        });

        if (!response.ok) throw new Error("Erro ao salvar o grupo no servidor.");

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
        // Fallback de segurança para locais caso a API falhe
        const locaisFallback = [
            { id: 1, nome: "Mercado Central", categoria: "gastronomia" },
            { id: 2, nome: "Praça da Liberdade", categoria: "cultura" },
            { id: 3, nome: "Mirante das Mangabeiras", categoria: "parque" }
        ];
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