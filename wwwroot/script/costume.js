// Seleciona todos os links do menu lateral
const menuLinks = document.querySelectorAll('#side-menu a');

menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove a classe 'active' de todos
        menuLinks.forEach(l => l.classList.remove('active'));
        // Adiciona ao que foi clicado
        this.classList.add('active');
    });
});