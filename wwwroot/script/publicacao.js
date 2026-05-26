let slideAtual = 0;
let totalSlides = 0;
let publicacaoId = null;
const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');
const inputComentario = document.getElementById('input-comentario');
const btnPublicar = document.getElementById('btn-publicar');

document.addEventListener('DOMContentLoaded', () => {
    // Pega o id da URL. Exemplo: detalhes.html?id=5
    const urlParams = new URLSearchParams(window.location.search);
    publicacaoId = urlParams.get('id');

    if (!publicacaoId) {
        alert("Nenhum ID de publicação foi informado na URL, uai!");
        return;
    }

    // Busca os dados da API
    carregarDadosDoPost();
});

async function carregarDadosDoPost() {
    try {
        const resposta = await fetch(`/api/publicacao/${publicacaoId}`);
        
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do servidor.");
        }

        const dados = await resposta.json();
        
        // Preenche os componentes na tela com os dados do banco
        renderizarPost(dados);

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao carregar a publicação.");
    }
}

// --- 3. INJETA OS DADOS NO HTML DINAMICAMENTE ---
function renderizarPost(dados) {
    // Cabeçalho e Autor do Post
    document.querySelectorAll('.username').forEach(el => el.innerText = `@${dados.username}`);
    document.querySelectorAll('.username').forEach(el => el.addEventListener("click", function (){
        window.location.href = `../page/profile.html?usuario=${dados.username}`
    }))
    document.querySelectorAll('.user-avatar').forEach(img => img.src = dados.userAvatar || 'https://i.pravatar.cc/150?img=33');
    
    // Localização e Legenda
    const locationAnchor = document.querySelector('.location');
    locationAnchor.innerHTML = `<i class="fa-solid fa-location-dot" id="localization"></i> ${dados.localizacaoNome}`;
    locationAnchor.addEventListener("click", function (){
        window.location.href = `../page/detalhes.html?id=${dados.localizacaoId}`
    })

    document.querySelector('.post-caption p').innerHTML = `<strong>@${dados.username}</strong> ${dados.legenda}`;
    
    // Métricas (Likes e Data)
    document.querySelector('.likes-count strong').innerText = dados.curtidas;
    document.querySelector('.post-date').innerText = calcularTempoPassado(dados.dataPublicacao);

    // --- RENDERIZAR O CARROSSEL (FOTOS DA TABELA) ---
    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    totalSlides = dados.fotos.length;

    // Seleciona os botões de avançar e voltar do carrossel
    const btnPrev = document.querySelector('.prev-btn');
    const btnNext = document.querySelector('.next-btn');

    curtido = dados.jaCurtiu; 

    const botaoLike = document.getElementById('like-main-btn');
    if (curtido) {
        botaoLike.innerHTML = '<i class="fa-solid fa-heart" style="color:#069E6E"></i>';
    } else {
        botaoLike.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }

    // Se tiver apenas 1 foto (ou nenhuma), esconde os controles. Caso contrário, mostra!
    if (totalSlides <= 1) {
        if (btnPrev) btnPrev.style.display = 'none';
        if (btnNext) btnNext.style.display = 'none';
        dotsContainer.style.display = 'none';
    } else {
        if (btnPrev) btnPrev.style.display = 'block';
        if (btnNext) btnNext.style.display = 'block';
        dotsContainer.style.display = 'flex';
    }

    dados.fotos.forEach((urlFoto, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${urlFoto}" alt="Imagem da publicação">`;
        track.appendChild(slide);

        const dot = document.createElement('span');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => irParaSlide(index));
        dotsContainer.appendChild(dot);
    });

    slideAtual = 0;
    atualizarCarrossel();
    // --- RENDERIZAR COMENTÁRIOS ---
    const listaComentarios = document.getElementById('lista-comentarios');
    listaComentarios.innerHTML = '';

    dados.comentarios.forEach(comentario => {
        const itemComentario = document.createElement('div');
        itemComentario.className = 'comment-item';
        itemComentario.innerHTML = `
            <img src="${comentario.userAvatar || 'https://i.pravatar.cc/150?img=11'}" alt="Avatar" class="user-avatar">
            <div class="comment-text">
                <p><strong>@${comentario.username}</strong> ${comentario.texto}</p>
                <span class="comment-time">${calcularTempoPassado(comentario.tempo)}</span>
            </div>
            <button class="like-comment-btn"><i class="fa-regular fa-heart"></i></button>
        `;
        listaComentarios.appendChild(itemComentario);
    });
}

//  LÓGICA DO CARROSSEL ---
function atualizarCarrossel() {
    // Move o trilho baseado no slide ativo multiplicado por 100% da largura
    track.style.transform = `translateX(-${slideAtual * 100}%)`;
    
    // Atualiza o estado visual das bolinhas (dots)
    const todosDots = document.querySelectorAll('.dot');
    todosDots.forEach((dot, index) => {
        if (index === slideAtual) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function moverSlide(direcao) {
    slideAtual = slideAtual + direcao;
    
    if (slideAtual >= totalSlides) {
        slideAtual = 0;
    }
    if (slideAtual < 0) {
        slideAtual = totalSlides - 1;
    }
    
    atualizarCarrossel();
}

function irParaSlide(index) {
    slideAtual = index;
    atualizarCarrossel();
}


async function togglePostLike() {
    const botao = document.getElementById('like-main-btn');
    const likesCountEl = document.querySelector('.likes-count strong');
    let totalAtualLikes = parseInt(likesCountEl.innerText);

    // Define a rota com base na ação que o usuário está tomando
    const acaoUrl = curtido ? `/api/publicacao/${publicacaoId}/deslike` : `/api/publicacao/${publicacaoId}/like`;

    try {
        const resposta = await fetch(acaoUrl, { method: 'POST' });

        if (resposta.ok) {
            curtido = !curtido;
            
            if (curtido) {
                botao.innerHTML = '<i class="fa-solid fa-heart" style="color:#069E6E"></i>';
                likesCountEl.innerText = totalAtualLikes + 1;
            } else {
                botao.innerHTML = '<i class="fa-regular fa-heart"></i>';
                likesCountEl.innerText = totalAtualLikes - 1;
            }
        } else {
            console.error("Erro ao processar o like no servidor.");
        }
    } catch (erro) {
        console.error("Erro na comunicação com a API de Likes:", erro);
    }
}

// CAIXA DE TEXTO DO COMENTÁRIO 
inputComentario.addEventListener('input', () => {
    btnPublicar.disabled = inputComentario.value.trim().length === 0;
});

async function enviarComentario() {
    const textoComentario = inputComentario.value.trim();
    
    try {
        const resposta = await fetch(`/api/publicacao/${publicacaoId}/comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoComentario }) // Aqui tá o nosso DTO!
        });

        if (resposta.ok) {
            inputComentario.value = ''; // Limpa o input
            btnPublicar.disabled = true;
            
            // Recarrega os dados do post para o novo comentário aparecer na lista automaticamente
            carregarDadosDoPost(); 
        } else {
            alert("Erro ao publicar comentário.");
        }
    } catch (erro) {
        console.error("Erro na requisição de comentário:", erro);
    }
}

// Vincula a função ao botão do Front
btnPublicar.addEventListener('click', enviarComentario);