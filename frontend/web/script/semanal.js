// Dados dos locais para o carrossel
const locaisData = [];

// Array para armazenar as publicações
let publicacoes = [];

function formatarDataInstagram(dataString) {
    const data = new Date(dataString);
    const agora = new Date();
    const diffSegundos = Math.floor((agora - data) / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);
    
    if (diffSegundos < 60) return "Agora mesmo";
    if (diffMinutos < 60) return `${diffMinutos} min`;
    if (diffHoras < 24) return `${diffHoras} h`;
    if (diffDias === 1) return "Ontem";
    if (diffDias < 7) return `${diffDias} dias`;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatarNumero(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function renderizarCarrossel() {
    const carrosselContainer = document.getElementById('carrossel-locais');
    if (!carrosselContainer) return;
    
    carrosselContainer.innerHTML = locaisData.map(local => `
        <div class="Card">
            <div class="card-image">
                <img src="${local.imagem}" alt="${local.nome}">
            </div>
            <div class="card-content">
                <div class="card-category">${local.categoria}</div>
                <h3>${local.nome}</h3>
                <p>${local.descricao}</p>
                <div class="card-stats">
                    <span>❤️ ${formatarNumero(local.curtidas)}</span>
                    <span>💬 ${formatarNumero(local.comentarios)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar publicações com layout de duas colunas
function renderizarPublicacoes() {
    const container = document.getElementById('publicacoes-container');
    if (!container) return;
    
    if (publicacoes.length === 0) {
        container.innerHTML = `<div class="nenhuma-publicacao"><p> Nenhuma publicação ainda</p></div>`;
        return;
    }
    
    container.innerHTML = publicacoes.map(pub => `
        <div class="post-duas-colunas" data-id="${pub.id}">
            <!-- Coluna da Esquerda: Foto -->
            <div class="post-coluna-esquerda">
                <div class="post-imagem-coluna" onclick="abrirFotoModal('${pub.fotoPost}')">
                    <img src="${pub.fotoPost}" alt="Foto do post">
                </div>
            </div>
            
            <!-- Coluna da Direita: Conteúdo -->
            <div class="post-coluna-direita">
                <!-- Header com perfil -->
                <div class="post-header-coluna">
                    <div class="post-user-coluna">
                        <img class="post-avatar-coluna" src="${pub.avatar}" alt="${pub.autor}" onclick="irParaPerfil(${pub.userId})">
                        <div class="post-user-info-coluna">
                            <a href="#" onclick="irParaPerfil(${pub.userId}); return false;" class="post-username-coluna">${pub.username}</a>
                            <span class="post-local-coluna">📍 ${pub.local}</span>
                        </div>
                    </div>
                    <button class="post-menu-coluna" onclick="abrirMenuPost(${pub.id})">•••</button>
                </div>
                
                <!-- Ações (curtir/comentar) -->
                <div class="post-actions-coluna">
                    <button class="action-btn-coluna like-btn-coluna" onclick="curtirPublicacao(${pub.id})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span>Curtir</span>
                    </button>
                    <button class="action-btn-coluna" onclick="abrirComentarios(${pub.id})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        <span>Comentar</span>
                    </button>
                </div>
                
                <!-- Curtidas -->
                <div class="post-likes-coluna">
                    <span class="likes-count-coluna">${formatarNumero(pub.curtidas)} curtidas</span>
                </div>
                
                <!-- Legenda/Texto do post -->
                <div class="post-caption-coluna">
                    <a href="#" onclick="irParaPerfil(${pub.userId}); return false;" class="caption-username-coluna">${pub.username}</a>
                    <span class="caption-text-coluna">${pub.feedback}</span>
                </div>
                
                <!-- Comentários -->
                <div class="post-comments-coluna">
                    ${pub.comentariosList.length > 0 ? `
                        <button class="view-comments-coluna" onclick="verTodosComentarios(${pub.id})">
                            Ver todos os ${pub.comentariosList.length} comentários
                        </button>
                        ${pub.comentariosList.slice(0, 2).map(com => `
                            <div class="comment-item-coluna">
                                <a href="#" onclick="irParaPerfilPorNome('${com.usuario}'); return false;" class="comment-username-coluna">${com.usuario}</a>
                                <span class="comment-text-coluna">${com.texto}</span>
                                <span class="comment-time-coluna">${com.data}</span>
                            </div>
                        `).join('')}
                    ` : `
                        <div class="sem-comentarios-coluna">Nenhum comentário ainda. Seja o primeiro!</div>
                    `}
                </div>
                
                <!-- Timestamp e Avaliação -->
                <div class="post-footer-coluna">
                    <div class="post-time-coluna">${formatarDataInstagram(pub.data)}</div>
                    <div class="post-rating-coluna">
                        ${gerarEstrelasPequenas(pub.rating)}
                        <span class="rating-text-coluna">Avaliação</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function gerarEstrelasPequenas(rating) {
    let estrelas = '';
    for (let i = 1; i <= 5; i++) {
        estrelas += `<span class="star-small-coluna ${i <= rating ? 'filled' : ''}">★</span>`;
    }
    return estrelas;
}

// Modal de comentários
function abrirComentarios(postId) {
    const post = publicacoes.find(p => p.id === postId);
    if (!post) return;
    
    const modalComentarios = document.createElement('div');
    modalComentarios.className = 'comentarios-modal-overlay';
    modalComentarios.innerHTML = `
        <div class="comentarios-modal">
            <div class="comentarios-modal-header">
                <div class="comentarios-header-info">
                    <img class="comentarios-modal-avatar" src="${post.avatar}" alt="${post.autor}">
                    <div>
                        <h3>${post.username}</h3>
                        <span>📍 ${post.local}</span>
                    </div>
                </div>
                <button class="fechar-comentarios" onclick="this.closest('.comentarios-modal-overlay').remove()">✕</button>
            </div>
            <div class="comentarios-list">
                ${post.comentariosList.map(com => `
                    <div class="comentario-item">
                        <img class="comentario-avatar" src="https://ui-avatars.com/api/?name=${com.nome}&background=069E6E&color=fff" alt="${com.nome}">
                        <div class="comentario-content">
                            <div class="comentario-header">
                                <a href="#" onclick="irParaPerfilPorNome('${com.usuario}'); return false;" class="comentario-usuario">${com.usuario}</a>
                                <span class="comentario-data">${com.data}</span>
                            </div>
                            <span class="comentario-texto">${com.texto}</span>
                        </div>
                    </div>
                `).join('')}
                ${post.comentariosList.length === 0 ? '<div class="sem-comentarios-modal">Nenhum comentário ainda. Seja o primeiro!</div>' : ''}
            </div>
            <div class="comentarios-modal-footer">
                <input type="text" id="novoComentarioInput" placeholder="Adicione um comentário..." class="comentario-input">
                <button class="btn-enviar-comentario" onclick="adicionarComentario(${postId})">Publicar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalComentarios);
}

function adicionarComentario(postId) {
    const input = document.getElementById('novoComentarioInput');
    const texto = input.value.trim();
    
    if (!texto) return;
    
    const post = publicacoes.find(p => p.id === postId);
    if (post) {
        const novoComentario = {
            id: Date.now(),
            usuario: "@usuario_atual",
            nome: "Usuário Atual",
            texto: texto,
            data: "Agora mesmo"
        };
        post.comentariosList.push(novoComentario);
        renderizarPublicacoes();
        
        const modal = document.querySelector('.comentarios-modal-overlay');
        if (modal) modal.remove();
        
        mostrarToast("Comentário adicionado! 💬");
    }
}

function verTodosComentarios(postId) {
    abrirComentarios(postId);
}

// Funções de foto modal
function abrirFotoModal(imgSrc) {
    const modal = document.getElementById('fotoModal');
    const modalImg = document.getElementById('fotoModalImg');
    modalImg.src = imgSrc;
    modal.classList.add('active');
}

function fecharFotoModal() {
    const modal = document.getElementById('fotoModal');
    modal.classList.remove('active');
}

// Curtir publicação
function curtirPublicacao(id) {
    const publicacao = publicacoes.find(p => p.id === id);
    if (publicacao) {
        publicacao.curtidas++;
        renderizarPublicacoes();
        
        const likeBtn = document.querySelector(`.post-duas-colunas[data-id="${id}"] .like-btn-coluna`);
        if (likeBtn) {
            likeBtn.classList.add('liked');
            setTimeout(() => likeBtn.classList.remove('liked'), 300);
        }
        mostrarToast("Você curtiu! ❤️");
    }
}

function irParaPerfil(userId) {
    mostrarToast(`Redirecionando para o perfil do usuário`);
}

function irParaPerfilPorNome(username) {
    mostrarToast(`Redirecionando para o perfil de ${username}`);
}

function abrirMenuPost(id) {
    mostrarToast("Opções do post");
}

function toggleModalPublicacao() {
    const modal = document.getElementById('modalPublicacao');
    modal.classList.toggle('active');
    if (!modal.classList.contains('active')) {
        document.getElementById('formPublicacao').reset();
    }
}

function publicarPost(event) {
    event.preventDefault();
    
    const local = document.getElementById('local').value;
    const feedback = document.getElementById('feedback').value;
    const rating = document.querySelector('input[name="rating"]:checked');
    
    if (!local || !feedback || !rating) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const novaPublicacao = {
        id: publicacoes.length + 1,
        local: local,
        feedback: feedback,
        rating: parseInt(rating.value),
        data: new Date().toISOString(),
        autor: "Usuário Atual",
        username: "@usuario_atual",
        userId: 99,
        avatar: "https://via.placeholder.com/100",
        fotoPost: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop",
        curtidas: 0,
        comentariosList: []
    };
    
    publicacoes.unshift(novaPublicacao);
    renderizarPublicacoes();
    toggleModalPublicacao();
    mostrarToast("Publicação realizada! 🎉");
}

function mostrarToast(mensagem) {
    const toast = document.createElement('div');
    toast.textContent = mensagem;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #262626;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 14px;
        z-index: 3000;
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOutDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrossel();
    renderizarPublicacoes();
    
    const form = document.getElementById('formPublicacao');
    if (form) form.addEventListener('submit', publicarPost);
});

window.toggleMenu = toggleMenu;
window.toggleModalPublicacao = toggleModalPublicacao;
window.curtirPublicacao = curtirPublicacao;
window.abrirComentarios = abrirComentarios;
window.adicionarComentario = adicionarComentario;
window.verTodosComentarios = verTodosComentarios;
window.abrirFotoModal = abrirFotoModal;
window.fecharFotoModal = fecharFotoModal;
window.irParaPerfil = irParaPerfil;
window.irParaPerfilPorNome = irParaPerfilPorNome;
window.abrirMenuPost = abrirMenuPost;