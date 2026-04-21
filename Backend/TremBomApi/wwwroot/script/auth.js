// =============================================
// CONTROLE DE AUTENTICAÇÃO - INTERFACE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos da interface - PEGA DE QUALQUER PÁGINA
    const btnLoginHeader = document.getElementById('btnLoginHeader');
    const btnPerfilHeader = document.getElementById('btnPerfilHeader');
    const linkPerfil = document.getElementById('linkPerfil');
    const sidebarLinkPerfil = document.getElementById('sidebarLinkPerfil');
    const btnLogoutSidebar = document.getElementById('btnLogoutSidebar');
    const btnExplorarLocais = document.getElementById('btnExplorarLocais');
    const btnExplorarCostumes = document.getElementById('btnExplorarCostumes');
    
    // =============================================
    // ATUALIZA INTERFACE BASEADO NA AUTENTICAÇÃO
    // =============================================
    function atualizarInterface() {
        const autenticado = AuthService.isAuthenticated();
        const usuario = AuthService.getUsuario();
        
        if (autenticado) {
            // Usuário logado
            if (btnLoginHeader) btnLoginHeader.style.display = 'none';
            if (btnPerfilHeader) {
                btnPerfilHeader.style.display = 'block';
                btnPerfilHeader.textContent = `👤 ${AuthService.getNomeCurto()}`;
            }
            if (btnLogoutSidebar) btnLogoutSidebar.style.display = 'block';
            if (linkPerfil) linkPerfil.href = '../page/perfil.html';
            if (sidebarLinkPerfil) sidebarLinkPerfil.href = '../page/perfil.html';
        } else {
            // Usuário deslogado
            if (btnLoginHeader) btnLoginHeader.style.display = 'block';
            if (btnPerfilHeader) btnPerfilHeader.style.display = 'none';
            if (btnLogoutSidebar) btnLogoutSidebar.style.display = 'none';
            if (linkPerfil) linkPerfil.href = '../page/login.html';
            if (sidebarLinkPerfil) sidebarLinkPerfil.href = '../page/login.html';
        }
    }
    
    // =============================================
    // REDIRECIONAMENTOS
    // =============================================
    function redirecionarParaLogin() {
        window.location.href = '../page/login.html';
    }
    
    function redirecionarParaPerfil() {
        if (AuthService.isAuthenticated()) {
            window.location.href = '../page/perfil.html';
        } else {
            window.location.href = '../page/login.html';
        }
    }
    
    async function fazerLogout() {
        if (confirm('Tem certeza que deseja sair?')) {
            await AuthService.logout();
            atualizarInterface();
            
            const paginaAtual = window.location.pathname;
            if (paginaAtual.includes('../page/perfil.html')) {
                window.location.href = '../page/login.html';
            }
        }
    }
    
    // =============================================
    // EVENT LISTENERS - AQUI ESTÁ O IMPORTANTE!
    // =============================================
    
    // Botão "Entrar" na navbar
    if (btnLoginHeader) {
        btnLoginHeader.addEventListener('click', redirecionarParaLogin);
    }
    
    // Botão "Perfil" na navbar
    if (btnPerfilHeader) {
        btnPerfilHeader.addEventListener('click', redirecionarParaPerfil);
    }
    
    // Link "Perfil" na navbar
    if (linkPerfil) {
        linkPerfil.addEventListener('click', function(e) {
            e.preventDefault();
            redirecionarParaPerfil();
        });
    }
    
    // Link "Perfil" na sidebar
    if (sidebarLinkPerfil) {
        sidebarLinkPerfil.addEventListener('click', function(e) {
            e.preventDefault();
            redirecionarParaPerfil();
        });
    }
    
    // Botão "Sair" na sidebar
    if (btnLogoutSidebar) {
        btnLogoutSidebar.addEventListener('click', fazerLogout);
    }
    
    // Botão "Explorar locais"
    if (btnExplorarLocais) {
        btnExplorarLocais.addEventListener('click', function() {
            window.location.href = '../page/locais.html';
        });
    }
    
    // Botão "Explorar costumes"
    if (btnExplorarCostumes) {
        btnExplorarCostumes.addEventListener('click', function() {
            window.location.href = '../page/semanal.html';
        });
    }
    
    // =============================================
    // INICIALIZAÇÃO
    // =============================================
    atualizarInterface();
    
    window.fazerLogout = fazerLogout;
    window.atualizarInterface = atualizarInterface;
});

// =============================================
// TOGGLE MENU MOBILE
// =============================================
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}