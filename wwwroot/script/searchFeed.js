window.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btn-nav-inicio');
    const btnPesquisar = document.getElementById('btn-nav-pesquisar');
    const tabFeed = document.getElementById('tab-feed');
    const tabSearch = document.getElementById('tab-search');

    function alternarAba(abaParaMostrar, abaParaEsconder, botaoAtivo, botaoInativo) {
        abaParaEsconder.style.display = 'none';
        abaParaMostrar.style.display = 'block';
        botaoInativo.classList.remove('active');
        botaoAtivo.classList.add('active');
    }
    // Configuração da "aba" de pesquisa
    btnPesquisar.addEventListener('click', () => {
        alternarAba(tabSearch, tabFeed, btnPesquisar, btnInicio);
        const inputSearch = document.getElementById('input-search');
        inputSearch.setCustomValidity("");
        const buttonSearch = document.getElementById('search-button');
        inputSearch.focus();
        const errorSpan = document.getElementById('input-search-error');
        buttonSearch.addEventListener('click', () => {
            const query = inputSearch.value.trim();
            if (!query) {
                inputSearch.classList.add('erro');
                errorSpan.textContent = 'Por favor, digite algo para pesquisar.';
                errorSpan.style.display = 'block';
            } else {
                inputSearch.classList.remove('erro');
                inputSearch.setCustomValidity('');
                errorSpan.textContent = '';
                errorSpan.style.display = 'none';
            }
            });
        
            inputSearch.addEventListener('input', function() {
                this.setCustomValidity("");
                inputSearch.classList.remove('erro');
                errorSpan.style.display = 'none';
            });
        });
        

    btnInicio.addEventListener('click', () => {
        alternarAba(tabFeed, tabSearch, btnInicio, btnPesquisar);
    });
});