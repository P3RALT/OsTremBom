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
            const resposta = await fetch(`/api/publicacao/feed?offset=${offset}&limit=${limit}`);
            
            if (resposta.ok) {
                const posts = await resposta.json();
                
                if (posts.length < limit) {
                    fimDosPosts = true;
                }

                if (posts.length > 0) {
                    renderizarPosts(posts);
                    offset += limit; 
                }
            } else {
                console.error("Erro ao buscar o feed.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        } finally {
            carregando = false;
        }
    }

    function renderizarPosts(posts) {
        posts.forEach(post => {
            const article = document.createElement("article");
            article.classList.add("post-card");
            
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
                        <i class="fa-regular fa-heart"></i>
                        <i class="fa-regular fa-comment"></i>
                    </div>
                    <span class="likes">${post.likes || 0} curtidas</span>
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
    
    function calcularTempoPassado(timestamp) {
        const conversaoTime = parseInt(timestamp);
        if (isNaN(conversaoTime)) return "Data inválida";

        const dataPost = new Date(conversaoTime);
        const agora = new Date();
        const diferencaEmSegundos = Math.floor((agora - dataPost) / 1000);

        if (diferencaEmSegundos < 60) {
            return "Agora mesmo";
        }

        const diferencaEmMinutos = Math.floor(diferencaEmSegundos / 60);
        if (diferencaEmMinutos < 60) {
            return `Há ${diferencaEmMinutos} ${diferencaEmMinutos === 1 ? 'minuto' : 'minutos'}`;
        }

        const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);
        if (diferencaEmHoras < 24) {
            return `Há ${diferencaEmHoras} ${diferencaEmHoras === 1 ? 'hora' : 'horas'}`;
        }

        const diferencaEmDias = Math.floor(diferencaEmHoras / 24);
        if (diferencaEmDias < 7) {
            return `Há ${diferencaEmDias} ${diferencaEmDias === 1 ? 'dia' : 'dias'}`;
        }

        return dataPost.toLocaleDateString('pt-BR');
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