async function inicializarGaleria() {
            const container = document.getElementById('lista-locais');

            try {
                // Chamada para o endpoint do seu banco de dados
                const resposta = await fetch('http://localhost:5207/api/locais');
                
                if (!resposta.ok) throw new Error('Erro na comunicação com o servidor');

                const dados = await resposta.json();
                
                // Limpa o aviso de "Carregando"
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
                console.error('Falha:', erro);
                container.innerHTML = `
                    <div class="feedback-usuario" style="color: #c1351d;">
                        Ops! Não conseguimos carregar os dados. Verifique se sua API está ativa.
                    </div>`;
            }
        }

        // Executa a função assim que o script é lido
        inicializarGaleria();