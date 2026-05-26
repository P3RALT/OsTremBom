/**
 * PROPÓSITO DO SCRIPT: Local.js
 * Carrega a lista completa de locais turísticos salvos e renderiza cartões (Cards) estilizados na tela.
 */
async function inicializarGaleria() {
    const container = document.getElementById('lista-locais');
    if (!container) return;

    try {
        // CORREÇÃO: Ajustado caminho fixo localhost:5207 para rota relativa segura
        const resposta = await fetch('/api/locais');
        if (!resposta.ok) throw new Error('Erro na comunicação com o servidor');

        const dados = await resposta.json();
        
        // Limpa elementos visuais de carregamento ou mensagens temporárias
        container.innerHTML = '';

        // Varre a lista de estabelecimentos injetando templates dinâmicos
        dados.forEach(item => {
            const template = `
                <a href="../page/detalhes.html?id=${item.id || item.Id}" class="card-link">
                <article class="card-container">
                    <img class="card-imagem" src="${item.imagemUrl || '../img/default-bh.jpg'}" alt="${item.nome || item.Nome}">
                    
                    <div class="card-conteudo">
                        <span class="card-tag">${item.categoria || item.Categoria || 'Destaque'}</span>
                        <h2 class="card-titulo">${item.nome || item.Nome}</h2>
                        <p class="card-texto">${item.descricao || item.Resumo || 'Veja detalhes e dicas sobre este local incrível.'}</p>
                        
                        <div class="card-info-social">
                            ❤️ ${item.totalLikes ?? 0} curtidas • 💬 ${item.totalComentarios ?? 0} comentários
                        </div>
                    </div>
                </article>
                </a>
            `;
            container.innerHTML += template;
        });

    } catch (erro) {
        console.error('Falha ao carregar galeria principal:', erro);
        container.innerHTML = `
            <div class="feedback-usuario" style="color: #c1351d; font-weight: bold; padding: 20px; text-align: center;">
                Ops! Não conseguimos carregar os dados. Verifique se sua API está ativa.
            </div>`;
    }
}

// Inicialização automática do script
inicializarGaleria();


/**
 * PROPÓSITO DO SCRIPT: LocalCarrossel.js
 * Alimenta dinamicamente os containers deslizantes da Home / Feed com sugestões rápidas de locais.
 */
async function carregarLocaisCarrossel() {
    const container = document.getElementById('carrossel-locais');
    if (!container) return;

    try {
        // CORREÇÃO: Ajustada a URL fixa para caminho relativo flexível
        const response = await fetch('/api/locais'); 
        if (!response.ok) throw new Error("Erro ao buscar dados da API");

        const locais = await response.json();
        container.innerHTML = '';

        locais.forEach(local => {
            const card = document.createElement('div');
            card.className = 'Card';

            card.innerHTML = `
                <div class="card-image">
                    <button class="btn-favorito" onclick="favoritar(${local.id || local.Id}, event)">♡</button>
                    <img src="${local.imagemUrl || '../img/default-bh.jpg'}" alt="${local.nome || local.Nome}">
                </div>
                <div class="card-content">
                    <div class="card-rating">
                        <span>●●●●●</span> (1)
                    </div>
                    <h3>${local.nome || local.Nome}</h3>
                    <p class="card-category">${local.categoria || local.Categoria || "Geral"}</p>
                    <button class="btn-reservar" onclick="verDetalhes(${local.id || local.Id})">Ver mais</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro no carrossel:", error);
        container.innerHTML = `<p style="padding: 20px; color: orange;">Uai, deu um erro ao carregar os trens: ${error.message}</p>`;
    }
}

// Escutadores globais auxiliares mapeados no escopo do Carrossel
function favoritar(id, event) {
    event.stopPropagation(); // Impede o clique de disparar navegações indesejadas no card pai
    alert("Local adicionado aos seus favoritos com sucesso!");
}

function verDetalhes(id) {
    window.location.href = `../page/detalhes.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', carregarLocaisCarrossel);