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
            `/api/busca/${encodeURIComponent(termo)}`
        );
        
        const resultados = await resposta.json();
        resultadosDiv.innerHTML = "";

        if (resultados.length === 0) {
            resultadosDiv.style.display = "none";
            defaultSearchText.style.display = "block";
            return;
        }
        defaultSearchText.style.display = "none";
        resultados.forEach(resultado => {

            const item = document.createElement("div");
            item.classList.add("resultado-item");

            console.log(resultado);

            if (resultado.tipo == "Local") {

                item.innerHTML = `
                    <strong>${resultado.nome}</strong>
                    <p>
                        ${resultado.rua}
                        ${resultado.numero},
                        ${resultado.bairro} -
                        ${resultado.cidade}
                    </p>
                `;

                item.addEventListener("click", () => {

                    buscaInput.value = resultado.nome;

                    resultadosDiv.innerHTML = "";
                    resultadosDiv.style.display = "none";

                    window.location.href = `/page/detalhes.html?id=${resultado.id}`;
                });

            } else {

                item.innerHTML = `
                    <strong>${resultado.nome}</strong>
                `;

                item.addEventListener("click", () => {

                    buscaInput.value = resultado.nome;

                    resultadosDiv.innerHTML = "";
                    resultadosDiv.style.display = "none";

                    window.location.href = `/page/profile.html?usuario=${resultado.nome}`;
                });
            }

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
