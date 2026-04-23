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
                    const template = `
                        <a href="../page/detalhes.html?id=${item.id}" class="card-link">
                        <article class="card-container">
                            <img class="card-imagem" src="${item.imagemUrl || 'https://via.placeholder.com/400x250'}" alt="${item.nome}">
                            
                            <div class="card-conteudo">
                                <span class="card-tag">${item.categoria || 'Destaque'}</span>
                                <h2 class="card-titulo">${item.nome}</h2>
                                <p class="card-texto">${item.descricao || 'Descrição não informada.'}</p>
                                
                                <div class="card-info-social">
                                    ❤️ ${item.totalLikes} curtidas • 💬 ${item.totalComentarios}
                                </div>
                            </div>
                        </article>
                        </a>
                    `;
                    container.innerHTML += template;
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