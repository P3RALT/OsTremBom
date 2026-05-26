/**
 * PROPÓSITO DO SCRIPT: ToggleMenu.js (E expansão de mapas Leaflet)
 * Controla a barra lateral responsiva (Sidebar) em dispositivos móveis e gerencia 
 * o ciclo de vida dos mapas expandidos em tela cheia para cada publicação do feed.
 */

/**
 * Ativa ou desativa a visualização do menu lateral móvel.
 * Controla o estado das classes CSS e gerencia a visibilidade do botão de gatilho.
 */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('menu-button');
    
    if (!sidebar || !overlay || !btn) {
        console.warn("Elementos do menu responsivo não foram localizados no DOM atual.");
        return;
    }

    // Alterna a classe 'active' que ativa as transições de CSS (ex: transform: translateX(0))
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Otimização visual: esconde o botão hambúrguer enquanto a barra lateral estiver aberta
    if (sidebar.classList.contains('active')) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'block';
    }
}

// Vincula o fechamento automático ao clicar no fundo escuro (Overlay) caso o escutador já exista no HTML
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        // Se o usuário clicar na parte escura, fecha o menu de forma amigável
        overlay.addEventListener("click", () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    }
});

// Cache global para rastrear instâncias ativas de mapas e evitar recriações redundantes na memória
const fullMaps = {};

/**
 * Torna visível o container do mapa em tela cheia e força a renderização das camadas geográficas.
 * @param {string|number} postId - ID exclusivo da publicação dona do mapa.
 * @param {number} lat - Latitude do estabelecimento.
 * @param {number} lng - Longitude do estabelecimento.
 */
function expandMap(postId, lat, lng) {
    const container = document.getElementById(`expanded-map-${postId}`);
    if (!container) return;

    // Exibe a janela flutuante/modal do mapa
    container.style.display = 'block';

    // CASO 1: É a primeira vez que o usuário abre o mapa deste post específico
    if (!fullMaps[postId]) {

        // Inicializa a instância do mapa atrelada ao container gerado no feed
        const map = L.map(`full-map-${postId}`).setView([lat, lng], 16);

        // Alimenta o mapa com a camada gráfica do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Adiciona a marcação circular característica do projeto "TremBom"
        L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: "#069E6E", // Cor verde padrão da identidade visual da API
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        // Salva a instância criada no objeto global para reutilização futura
        fullMaps[postId] = map;

        // O TIMEOUT CRÍTICO: Aguarda 100 milissegundos para o navegador processar o 'display: block' 
        // e força o redesenho das bordas do mapa para não aparecer cinza ou cortado.
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

    } 
    // CASO 2: O mapa já existe em memória cache, apenas recalculamos o tamanho por segurança
    else {
        setTimeout(() => {
            if (fullMaps[postId]) {
                fullMaps[postId].invalidateSize();
            }
        }, 100);
    }
}

/**
 * Oculta o container do mapa expandido alterando o display CSS.
 * @param {string|number} postId - ID exclusivo da publicação.
 */
function closeMap(postId) {
    const container = document.getElementById(`expanded-map-${postId}`);
    if (container) {
        container.style.display = 'none';
    }
}

// Exporta as funções para o escopo global do navegador (Window) 
// garantindo que os seletores inline 'onclick=""' do HTML consigam dispará-las sem problemas.
window.toggleMenu = toggleMenu;
window.expandMap = expandMap;
window.closeMap = closeMap;