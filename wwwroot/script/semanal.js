// Função para abrir o modal de criação de grupo
function abrirModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.add('active');
    }
}

// Função para fechar o modal
function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo').reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
    }
}

// Monitora o select de privacidade para exibir ou ocultar a senha
function tratarMudancaPrivacidade() {
    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    const containerSenha = document.getElementById('container-senha-grupo');
    const inputSenha = document.getElementById('grupoSenha');

    if (selectPrivacidade.value === 'privado') {
        containerSenha.style.display = 'block';
        inputSenha.setAttribute('required', 'required'); // Torna obrigatório se for privado
    } else {
        containerSenha.style.display = 'none';
        inputSenha.removeAttribute('required'); // Remove a obrigatoriedade
        inputSenha.value = ''; // Limpa o campo
    }
}

// Simulação de envio (Pronto para o seu fetch do Backend futuramente)
function salvarGrupo(event) {
    event.preventDefault();
    
    // Captura dos dados (Exemplo estruturado para uso posterior)
    const dadosGrupo = {
        nome: document.getElementById('grupoNome').value,
        descricao: document.getElementById('grupoDescricao').value,
        limiteMembros: document.getElementById('grupoLimite').value,
        privacidade: document.getElementById('grupoPrivacidade').value,
        senha: document.getElementById('grupoSenha').value
    };

    console.log("Dados prontos para enviar à API:", dadosGrupo);
    
    // Aqui entrará seu código fetch para a TremBomApi
    alert('Grupo criado com sucesso! (Simulação)');
    fecharModalGrupo();
}

// Array global para armazenar os locais vindos do banco de dados temporariamente
// Array global para armazenar os locais vindos do banco de dados temporariamente
let locaisDoBancoGlobal = [];

// Função que define qual ícone usar baseado na Categoria da sua Model C#
function obterIconePorCategoria(categoria) {
    if (!categoria) return 'fa-solid fa-location-dot'; 
    
    const cat = categoria.toLowerCase();
    if (cat.includes('gastronomia') || cat.includes('alimentação') || cat.includes('mercado')) {
        return 'fa-solid fa-cart-shopping'; 
    }
    if (cat.includes('bar') || cat.includes('noite') || cat.includes('bebida')) {
        return 'fa-solid fa-glass-martini-alt'; 
    }
    if (cat.includes('parque') || cat.includes('natureza')) {
        return 'fa-solid fa-tree';
    }
    if (cat.includes('cultura') || cat.includes('arte') || cat.includes('arquitetura')) {
        return 'fa-solid fa-landmark';
    }
    return 'fa-solid fa-location-dot';
}

// Abre o sub-modal e carrega a lista
async function abrirSubModalLocais() {
    const subModal = document.getElementById('subModalLocais');
    if (subModal) {
        subModal.classList.add('active');
        // Reseta o campo de busca toda vez que abre o submenu
        document.getElementById('input-pesquisa-local').value = "";
        await carregarLocaisParaVinculo();
    }
}

// Fecha o sub-modal de locais
function fecharSubModalLocais() {
    const subModal = document.getElementById('subModalLocais');
    if (subModal) {
        subModal.classList.remove('active');
    }
}

// Faz o fetch GET na sua Controller para listar os locais salvos
async function carregarLocaisParaVinculo() {
    const listaContainer = document.getElementById('lista-locais-dinamica');
    listaContainer.innerHTML = "<p style='color:#718096; font-size:13px; text-align:center;'>Carregando locais de BH...</p>";

    try {
        // Altere para a URL real da sua API quando rodar o backend
        const resposta = await fetch('http://localhost:5207/api/Locais');
        
        if (!resposta.ok) throw new Error("Falha na resposta do servidor");
        
        const locais = await resposta.json();
        locaisDoBancoGlobal = locais; 
        renderizarListaLocais(locais);

    } catch (erro) {
        console.warn("API Offline. Carregando dados locais de simulação para desenvolvimento.", erro);
        // Fallback ativo: Se der erro na API, ele usa a lista estática de BH
        locaisDoBancoGlobal = locaisFallback;
        renderizarListaLocais(locaisFallback);
    }
}

// Renderiza os botões dinâmicos na tela
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
            <i class="${iconeClass}"></i>
            <span>${local.nome}</span>
        `;
        
        listaContainer.appendChild(divLinha);
    });
}

// Filtra a lista em tempo real enquanto digita na barra de pesquisa
function filtrarLocaisLista() {
    const termo = document.getElementById('input-pesquisa-local').value.toLowerCase();
    const filtrados = locaisDoBancoGlobal.filter(l => l.nome.toLowerCase().includes(termo));
    renderizarListaLocais(filtrados);
}

// Salva a escolha no input hidden e atualiza o texto do botão principal
function selecionarLocalParaGrupo(id, nome) {
    document.getElementById('grupoLocalSelecionadoId').value = id;
    document.getElementById('texto-local-vinculado').innerText = `Local: ${nome}`;
    document.getElementById('texto-local-vinculado').style.fontWeight = '700';
    fecharSubModalLocais();
}