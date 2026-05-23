window.addEventListener('DOMContentLoaded', () => {
    const mainGrid = document.getElementById("tab-feed");
    
    let offset = 0; // A posição que a gente começa a puxar os posts (ex: agr é 0, na outra vira 10)
    const limit = 10; // Limitado a 10
    let carregando = false; // Evita requisições duplicadas ao mesmo tempo
    let fimDosPosts = false; // Para de buscar se a API não retornar mais nada

    async function carregarPosts() {
        if (carregando || fimDosPosts) return;
        
        carregando = true;
        try {
            // Passando os parâmetros de paginação na URL da API
            const resposta = await fetch(`/api/publicacao/feed?offset=${offset}&limit=${limit}`);
            
            if (resposta.ok) {
                const posts = await resposta.json();
                
                // Se a API retornar menos posts que o limite, significa que os posts acabaram
                if (posts.length < limit) {
                    fimDosPosts = true;
                }

                // Se houver posts, renderiza na tela
                if (posts.length > 0) {
                    renderizarPosts(posts);
                    // Incrementa o offset em 10 para a próxima busca
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

    // Função auxiliar para injetar os posts no HTML
    function renderizarPosts(posts) {
        posts.forEach(post => {
            const article = document.createElement("article");
            article.classList.add("post-card");
            
            const fotoCapa = post.fotosUrls && post.fotosUrls.length > 0 
                ? post.fotosUrls[0] 
                : '../img/placeholder-post.png';

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
                    <img src="${fotoCapa}" alt="${post.localNome || 'Publicação'}">
                    
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
    
    // Calcula a diferença entre a hora atual e o timestamp do post.
   function calcularTempoPassado(timestamp) {
    // Como passamos um número do C#, convertemos para Int antes de criar a data
    const conversaoTime = parseInt(timestamp);
    if (isNaN(conversaoTime)) return "Data inválida";

    const dataPost = new Date(conversaoTime);
    const agora = new Date();
    const diferencaEmSegundos = Math.floor((agora - dataPost) / 1000);

    // Se o fuso horário local der uma diferença negativa sutil, assume que foi agora
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

    // Detecta o scroll da página para carregar mais posts automaticamente quando o usuário chegar ao fim
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        
        // Se o usuário chegou a 100px do final da página, puxa mais 10 posts
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            carregarPosts();
        }
    });

    carregarPosts();
});

