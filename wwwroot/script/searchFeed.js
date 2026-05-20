window.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btn-nav-inicio');
    const btnPesquisar = document.getElementById('btn-nav-pesquisar');
    const tabFeed = document.getElementById('tab-feed');
    const tabSearch = document.getElementById('tab-search');
    const buscaInput = document.getElementById("input-search");
    const resultadosDiv = document.getElementById("resultados");
    const defaultSearchText = document.getElementById("default-search-text");
    const modoBusca = new URLSearchParams(window.location.search).get('search') === 'true';

    function alternarAba(abaParaMostrar, abaParaEsconder, botaoAtivo, botaoInativo) {
        abaParaEsconder.style.display = 'none';
        abaParaMostrar.style.display = 'block';
    }
    // se search=true, a gente já inicia na aba de pesquisa, senão inicia no feed normalmente
    if (modoBusca) {
        alternarAba(tabSearch, tabFeed, btnPesquisar, btnInicio);
    }
    // Configuração da "aba" de pesquisa
    btnPesquisar.addEventListener('click', () => {
        alternarAba(tabSearch, tabFeed, btnPesquisar, btnInicio);
        });
    btnInicio.addEventListener('click', () => {
        alternarAba(tabFeed, tabSearch, btnInicio, btnPesquisar);
    });

// Sistema de busca
buscaInput.addEventListener("input", async () => {

    const termo = buscaInput.value.trim();

    if (termo.length < 2) {
        resultadosDiv.innerHTML = "";
        resultadosDiv.style.display = "none";
        defaultSearchText.style.display = "block";
        return;
    }

    try {

        const resposta = await fetch(
            `/api/locais/buscar-criar-post?termo=${encodeURIComponent(termo)}`
        );

        const locais = await resposta.json();

        resultadosDiv.innerHTML = "";

        if (locais.length === 0) {
            resultadosDiv.style.display = "none";
            defaultSearchText.style.display = "block";
            return;
        }
        defaultSearchText.style.display = "none";
        locais.forEach(local => {

            const item = document.createElement("div");

            item.classList.add("resultado-item");

            item.innerHTML = `
                <strong>${local.nome}</strong>
                <p>
                    ${local.rua || local.Rua} 
                    ${local.numero || local.Numero},
                    ${local.bairro || local.Bairro} -
                    ${local.cidade || local.Cidade}
                </p>
            `;

            item.addEventListener("click", () => {

                buscaInput.value = local.nome;

                resultadosDiv.innerHTML = "";
                resultadosDiv.style.display = "none";
                 window.location.href = `/page/detalhes.html?id=${local.id}`;
            });

            resultadosDiv.appendChild(item);
        });

        resultadosDiv.style.display = "block";
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#input-search") &&
                !e.target.closest("#resultados")) {

                resultadosDiv.style.display = "none";
            }

        });

    } catch (erro) {
        console.error(erro);
    }
})});
