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

                // Loop para construir cada card
                dados.forEach(item => {
                    // 1. Garante que fotos seja um array válido (mesmo que venha apenas uma string ou nulo)
                    let fotos = [];
                    if (item.imagemUrl) {
                        // Se o C# mandar as fotos separadas por vírgula em uma string única:
                        fotos = typeof item.imagemUrl === 'string' && item.imagemUrl.includes(',') 
                            ? item.imagemUrl.split(',') 
                            : [item.imagemUrl];
                    } else if (item.fotosUrls && item.fotosUrls.length > 0) {
                        // Caso seu backend já envie como um array de strings puro:
                        fotos = item.fotosUrls;
                    } else {
                        fotos = ['https://via.placeholder.com/400x250'];
                    }

                    // Limita a exibição ao máximo de 3 fotos, conforme a regra de negócio
                    fotos = fotos.slice(0, 3);

                    // 2. Monta o HTML interno das imagens do carrossel
                    let carrosselItensHtml = '';
                    fotos.forEach((foto, index) => {
                        carrosselItensHtml += `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}" style="min-width: 100%;">
                                <img class="card-imagem" src="${foto}" alt="${item.nome}" style="width: 100%; height: 240px; object-fit: cover; display: block;">
                            </div>
                        `;
                    });

                    // 3. Só adiciona os botões de setinha e as bolinhas (dots) se houver mais de 1 foto
                    const botoesControleHtml = fotos.length > 1 ? `
                        <button class="carousel-control prev" style="font-size: 14px; padding: 6px 10px;" onclick="event.preventDefault(); window.mudarSlide(this, -1)">&#10094;</button>
                        <button class="carousel-control next" style="font-size: 14px; padding: 6px 10px;" onclick="event.preventDefault(); window.mudarSlide(this, 1)">&#10095;</button>
                        <div class="carousel-indicators" style="bottom: 8px; gap: 4px;">
                            ${fotos.map((_, i) => `<span class="indicator ${i === 0 ? 'active' : ''}" style="width: 6px; height: 6px;"></span>`).join('')}
                        </div>
                    ` : '';

                    // 4. Monta o template final do Card
                    const template = `
                        <a href="../page/detalhes.html?id=${item.id}" class="card-link">
                            <article class="card-container">
                                
                                <div class="post-carousel" style="position: relative; width: 100%; overflow: hidden;">
                                    <div class="carousel-track" style="display: flex; transition: transform 0.3s ease-in-out; width: 100%;">
                                        ${carrosselItensHtml}
                                    </div>
                                    ${botoesControleHtml}
                                </div>
                                
                                <div class="card-conteudo">
                                    <span class="card-tag">${item.categoria || 'Destaque'}</span>
                                    <h2 class="card-titulo">${item.nome}</h2>
                                    <p class="card-texto">${item.cidade} • ${item.distancia}</p>
                                    
                                    <div class="card-info-social">
                                        <i class="fa-regular fa-heart"></i> ${item.totalLikes || 0} curtidas • <i class="fa-regular fa-comment"></i> ${item.totalComentarios || 0} comentários
                                    </div>
                                </div>
                            </article>
                        </a>
                    `;

                    // Injeta o template no container do Grid
                    document.getElementById("lista-locais").innerHTML += template;
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