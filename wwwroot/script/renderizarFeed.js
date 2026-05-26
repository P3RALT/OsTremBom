window.addEventListener('DOMContentLoaded', () => {
    const estiloCarrossel = document.createElement('style');
    estiloCarrossel.innerHTML = `
        .post-carousel { position: relative; width: 100%; overflow: hidden; background: #fafafa; }
        .carousel-track { display: flex; transition: transform 0.4s ease-in-out; width: 100%; }
        .carousel-item { min-width: 100%; box-sizing: border-box; display: flex; justify-content: center; align-items: center; }
        /* AQUI ESTÁ O PADRÃO DE ALTURA DAS IMAGENS */
        .carousel-item img { width: 100%; height: 500px; display: block; object-fit: cover; }
        
        .carousel-control { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.4); color: white; border: none; font-size: 18px; padding: 10px 14px; cursor: pointer; border-radius: 50%; z-index: 10; transition: background 0.2s; }
        .carousel-control:hover { background: rgba(0, 0, 0, 0.7); }
        .carousel-control.prev { left: 10px; }
        .carousel-control.next { right: 10px; }
        .carousel-indicators { position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 10; }
        .indicator { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.5); transition: background 0.2s; }
        .indicator.active { background: #069E6E; transform: scale(1.2); }
    `;
    document.head.appendChild(estiloCarrossel);

    const mainGrid = document.getElementById("tab-feed");
    
    let offset = 0; 
    const limit = 10; 
    let carregando = false; 
    let fimDosPosts = false; 

    async function carregarPosts() {
    if (carregando || fimDosPosts) return;
    
    carregando = true;
    try {
        // Passa o offset dinâmico atualizado
        const resposta = await fetch(`/api/publicacao/feed?offset=${offset}&limit=${limit}`);
        
        if (resposta.ok) {
            const posts = await resposta.json();
            
            if (posts.length > 0) {
                renderizarPosts(posts);
                offset += posts.length; // Incrementa com base nos posts recebidos reais
            }

            // Se a API retornou menos do que pedimos, a base de dados zerou
            if (posts.length < limit) {
                fimDosPosts = true;
            }
        } else {
            console.error(resposta);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    } finally {
        carregando = false;
    }

    // Isolado em um bloco try-catch independente para o erro de um não quebrar o outro
    try {
        const respostaTrending = await fetch(`/api/publicacao/trending`);
        if (respostaTrending.ok) {
            const trending = await respostaTrending.json();
            renderizarTrending(trending);
        }
    } catch(error) {
        console.error("Erro na requisição do trending:", error);
    }
}

    function renderizarTrending(trending) {
        const containerTrending = document.getElementById("sidebar2");
        if (!containerTrending) return;
        const titulo = containerTrending.querySelector(".sidebar-logo");
        containerTrending.innerHTML = "";
        if (titulo) containerTrending.appendChild(titulo);
        trending.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("trending-item");
            div.innerHTML = `
            <a href="../page/detalhes.html?id=${item.id}" style="text-decoration: none; color: inherit;">
                    <div class="post-card trending-item" style="padding: 10px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fa-solid fa-arrow-trend-up" style="font-size: 16px;"></i>
                        <div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <span id="trending-title" style="font-weight: bold; line-height: 1.2;">${item.name}</span>
                            <span id="trending-category">${item.categoria} • ${item.totalLikes} likes</span>
                        </div>
                    </div>
                </div>
            </a>`
            containerTrending.appendChild(div);

        });
    }

    function renderizarPosts(posts) {
        posts.forEach(post => {
            
            const article = document.createElement("article");
            article.classList.add("post-card");
            // Lógica para mostrar o coração colorido ou n
            const classeCoracao = post.jaCurtiu ? 'fa-solid fa-heart curtido' : 'fa-regular fa-heart';
            
            const fotos = post.fotosUrls && post.fotosUrls.length > 0 
                ? post.fotosUrls 
                : ['../img/placeholder-post.png'];

            let carrosselItensHtml = '';
            fotos.forEach((foto, index) => {
                carrosselItensHtml += `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${foto}" alt="${post.localNome || 'Publicação'}">
                    </div>
                `;
            });

            const botoesControleHtml = fotos.length > 1 ? `
                <button class="carousel-control prev" onclick="window.mudarSlide(this, -1)">&#10094;</button>
                <button class="carousel-control next" onclick="window.mudarSlide(this, 1)">&#10095;</button>
                <div class="carousel-indicators">
                    ${fotos.map((_, i) => `<span class="indicator ${i === 0 ? 'active' : ''}"></span>`).join('')}
                </div>
            ` : '';

            article.innerHTML = `
                <div class="post-header">
                    <a href="../page/profile.html?usuario=${encodeURIComponent(post.nickname)}">
                        <div class="post-user">
                            <img src="${post.usuarioAvatar || '../img/default-avatar.jpg'}" alt="User">
                            <span>@${post.nickname}</span>
                        </div>
                    </a>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
                
                <div class="post-img">
                    <div class="post-carousel">
                        <div class="carousel-track">
                            ${carrosselItensHtml}
                        </div>
                        ${botoesControleHtml}
                    </div>
                    
                    <div class="map-balloon-wrapper" id="wrapper-post${post.id}">
                        <div id="mini-map-post${post.id}" class="mini-map"></div>
                        <div class="map-overlay-click" onclick="expandMap('post${post.id}', ${post.localLat || 0}, ${post.localLon || 0})"></div>
                    </div>

                    <div id="expanded-map-post${post.id}" class="expanded-map-container">
                        <button class="close-map" onclick="closeMap('post${post.id}')">×</button>
                        <div id="full-map-post${post.id}" class="full-map"></div>
                    </div>
                    
                    <a href="../page/detalhes.html?id=${post.localId}"> 
                        <div class="location-tag" style="display: flex; align-items: center;">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${post.localNome}, ${post.localCidade}</span>
                            <span class="heart"><i class="fa-solid fa-heart"></i>&nbsp;${post.localLikes || 0}</span>
                        </div>
                    </a>
                </div>
                
                <div class="post-footer">
                <div class="post-icons">
                    <i class="${classeCoracao}" data-post-id="${post.id}" onclick="alternarLike(this, ${post.id})"></i>
                    <a href="../page/publicacao.html?id=${post.id}" style="color: inherit; text-decoration: none;">
                        <i class="fa-regular fa-comment" style="cursor: pointer;"></i>
                    </a>
                </div>
                <span class="likes-contador-${post.id} likes">${post.likes || 0} curtidas</span>
                <div class="caption">
                    <b>@${post.nickname || 'usuario'}</b> ${post.legenda || ''}
                </div>
                <span class="time time-agenda" data-timestamp="${post.dataPublicacao}">Calculando...</span>
            </div>
            `;
            mainGrid.appendChild(article);
            createMiniMap(`mini-map-post${post.id}`, [post.localLat, post.localLon]);
        });
        atualizarTemposEmTempoReal();
    }
    

    function createMiniMap(id, coords) {
        const element = document.getElementById(id);

        if (!element) return;

        const map = L.map(id, {
            zoomControl: false,
            attributionControl: false
        }).setView(coords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            .addTo(map);

        L.circleMarker(coords, {
            radius: 8,
            fillColor: "#069E6E",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
    }

    function atualizarTemposEmTempoReal() {
        const elementosDeTempo = document.querySelectorAll('.time-agenda');
        elementosDeTempo.forEach(el => {
            const timestamp = el.getAttribute('data-timestamp');
            if (timestamp && timestamp !== "undefined") {
                el.textContent = calcularTempoPassado(timestamp);
            } else {
                el.textContent = "Data indisponível";
            }
        });
    }

    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            carregarPosts();
        }
    });
    // Detecta quando a tela muda de tamanho
    let timeoutResize;
    window.addEventListener('resize', () => {
        clearTimeout(timeoutResize);
        // Só executa o reset após o usuário parar de mexer no tamanho da tela por 100ms
        timeoutResize = setTimeout(() => {
            // Defina o tamanho máximo de tela que você considera "pequena" (ex: 768px para mobile)
                const todosCarrosseis = document.querySelectorAll('.post-carousel');
                
                todosCarrosseis.forEach(carousel => {
                    const track = carousel.querySelector('.carousel-track');
                    const itens = Array.from(track.children);
                    const indicators = Array.from(carousel.querySelectorAll('.indicator'));
                    
                    // Remove estado ativo de todo mundo
                    itens.forEach(item => item.classList.remove('active'));
                    if (indicators.length > 0) {
                        indicators.forEach(ind => ind.classList.remove('active'));
                        indicators[0].classList.add('active'); // Ativa a primeira bolinha
                    }
                    
                    // Força o primeiro item a ficar ativo e reseta a posição do slide para o início
                    if (itens.length > 0) {
                        itens[0].classList.add('active');
                    }
                    track.style.transform = 'translateX(0px)';
                });
        }, 100);
    });

    carregarPosts();
});

window.mudarSlide = function(botao, direcao) {
    const carousel = botao.closest('.post-carousel');
    const track = carousel.querySelector('.carousel-track');
    const itens = Array.from(track.children);
    const indicators = Array.from(carousel.querySelectorAll('.indicator'));
    
    const itemAtivo = track.querySelector('.carousel-item.active');
    let indexAtual = itens.indexOf(itemAtivo);
    
    itemAtivo.classList.remove('active');
    if (indicators.length > 0) indicators[indexAtual].classList.remove('active');
    
    indexAtual = (indexAtual + direcao + itens.length) % itens.length;
    
    itens[indexAtual].classList.add('active');
    if (indicators.length > 0) indicators[indexAtual].classList.add('active');
    
    const larguraSlide = itens[indexAtual].getBoundingClientRect().width;
    track.style.transform = `translateX(-${indexAtual * larguraSlide}px)`;
};
window.alternarLike = async function(elemento, postId) {
    // Evita cliques duplos enquanto a requisição acontece
    if (elemento.style.pointerEvents === 'none') return;
    elemento.style.pointerEvents = 'none';

    // Determina se a ação atual é um Like ou Deslike baseado na classe atual do ícone
    const ehDeslike = elemento.classList.contains('fa-solid');
    const url = `/api/publicacao/${postId}/${ehDeslike ? 'deslike' : 'like'}`;

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (resposta.ok) {
            // Se a requisição funcionou, atualiza o visual do ícone
            if (ehDeslike) {
                elemento.classList.remove('fa-solid', 'curtido');
                elemento.classList.add('fa-regular');
            } else {
                elemento.classList.remove('fa-regular');
                elemento.classList.add('fa-solid', 'curtido');
            }

            // Atualiza o contador de curtidas na tela sem recarregar a página
            const contador = document.querySelector(`.likes-contador-${postId}`);
            if (contador) {
                let quantidadeAtual = parseInt(contador.textContent) || 0;
                quantidadeAtual = ehDeslike ? quantidadeAtual - 1 : quantidadeAtual + 1;
                contador.textContent = `${quantidadeAtual} ${quantidadeAtual === 1 ? 'curtida' : 'curtidas'}`;
            }

        } else if (resposta.status === 401) {
            alert("Você precisa estar logado para curtir uma publicação.");
        } else {
            console.error("Erro ao processar o clique.");
        }
    } catch (erro) {
        console.error("Erro na comunicação com o servidor:", erro);
    } finally {
        // Reativa o clique no botão
        elemento.style.pointerEvents = 'auto';
    }
};