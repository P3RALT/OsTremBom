/**
 * DOCUMENTAÇÃO DO SCRIPT: buscaAvancada.js
 * Sistema de busca avançada corrigido para evitar encolhimento de componentes.
 * Cria os botões lado a lado e garante que os resultados quebrem a linha abaixo.
 */

window.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btn-nav-inicio');
    const btnPesquisar = document.getElementById('btn-nav-pesquisar');
    const tabFeed = document.getElementById('tab-feed');
    const tabSearch = document.getElementById('tab-search');
    const buscaInput = document.getElementById("input-search");
    const resultadosDiv = document.getElementById("resultados");
    const defaultSearchText = document.getElementById("default-search-text");
    const modoBusca = new URLSearchParams(window.location.search).get('search') === 'true';

    // Controle de estado do filtro ativo
    let filtroAtual = 'locais'; 

    // --- ETAPA 1: CRIAÇÃO E INJEÇÃO DOS BOTÕES ---
    // Criamos apenas os botões se eles ainda não existirem na tela
    let containerFiltros = document.getElementById("filtros-busca-dinamicos");
    if (!containerFiltros) {
        containerFiltros = document.createElement("div");
        containerFiltros.id = "filtros-busca-dinamicos";
        containerFiltros.innerHTML = `
            <button type="button" id="btn-filtro-locais" class="btn-filtro-dinamico active">
                <i class="fas fa-map-marker-alt"></i> Locais
            </button>
            <button type="button" id="btn-filtro-usuarios" class="btn-filtro-dinamico">
                <i class="fas fa-user"></i> Usuários
            </button>
        `;
        if (buscaInput && buscaInput.parentNode) {
            buscaInput.parentNode.insertBefore(containerFiltros, buscaInput.nextSibling);
        }
    }

    const btnFiltroLocais = document.getElementById('btn-filtro-locais');
    const btnFiltroUsuarios = document.getElementById('btn-filtro-usuarios');

    // --- ETAPA 2: FOLHA DE ESTILOS BLINDADA (Corrige o encolhimento da imagem 35823e) ---
    const estiloDinamico = document.createElement("style");
    estiloDinamico.innerHTML = `
        /* Garante que o container que segura o input e botões permita quebra de linha */
        #tab-search, .tab-search-container {
            display: flex !important;
            flex-wrap: wrap !important; /* Permite que elementos que não caibam desçam */
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 12px !important;
            width: 100% !important;
            max-width: 650px !important;
            margin: 0 auto !important;
        }

        /* Restaura o tamanho real do seu input de pesquisa */
        #input-search {
            flex: 1 !important; /* Faz o input crescer e ocupar o espaço restante */
            min-width: 200px !important; /* Não deixa ele encolher igual na imagem */
            padding: 10px 12px 10px 38px !important;
            font-size: 14px !important;
            border: 1px solid #dbdbdb !important;
            border-radius: 8px !important;
            background-color: #ffffff !important;
        }

        #filtros-busca-dinamicos {
            display: flex !important;
            gap: 12px !important;
        }

        /* Botões de filtro */
        .btn-filtro-dinamico {
            background-color: #f5f5f5;
            border: 1px solid #dbdbdb;
            color: #65676b;
            padding: 10px 18px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }
        .btn-filtro-dinamico.active { background-color: #0095f6; color: #ffffff; border-color: #0095f6; }

        /* CORREÇÃO DO CRASH VISUAL: Força os resultados a irem para baixo ocupando 100% da largura */
        #resultados {
            flex-basis: 100% !important; /* Força a quebra de linha obrigatória no flexbox */
            width: 100% !important;
            margin-top: 20px !important;
            display: none; /* Controlado pelo JS */
            flex-direction: column !important;
            gap: 14px !important;
        }

        /* O CARTÃO RECONFIGURADO E PARALELO */
        .busca-card-conteudo {
            display: flex !important;
            flex-direction: row !important; /* Garante alinhamento horizontal (Imagem ao lado do texto) */
            align-items: center !important;
            gap: 16px !important;
            padding: 14px 18px !important;
            background-color: #ffffff !important;
            border: 1px solid #dbdbdb !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
            cursor: pointer;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* Imagens internas */
        .busca-img-local { width: 60px !important; height: 60px !important; border-radius: 10px !important; object-fit: cover !important; flex-shrink: 0 !important; }
        .busca-avatar-usuario { width: 50px !important; height: 50px !important; border-radius: 50% !important; object-fit: cover !important; flex-shrink: 0 !important; }

        .busca-textos-wrapper { display: flex !important; flex-direction: column !important; gap: 4px !important; text-align: left !important; }
        .busca-textos-wrapper strong { font-size: 15px !important; font-weight: 700 !important; color: #262626 !important; }
        .busca-textos-wrapper p { margin: 0 !important; font-size: 13px !important; color: #8e8e8e !important; }
    `;
    document.head.appendChild(estiloDinamico);

    // --- ETAPA 3: CONTROLE DE FILTROS ---
    if (btnFiltroLocais && btnFiltroUsuarios) {
        btnFiltroLocais.addEventListener('click', () => {
            filtroAtual = 'locais';
            btnFiltroLocais.classList.add('active');
            btnFiltroUsuarios.classList.remove('active');
            executarBusca();
        });

        btnFiltroUsuarios.addEventListener('click', () => {
            filtroAtual = 'usuarios';
            btnFiltroUsuarios.classList.add('active');
            btnFiltroLocais.classList.remove('active');
            executarBusca();
        });
    }

    function alternarAba(abaParaMostrar, abaParaEsconder, botaoAtivo, botaoInativo) {
        abaParaEsconder.style.display = 'none';
        abaParaMostrar.style.display = 'block';
    }

    if (modoBusca) {
        alternarAba(tabSearch, tabFeed, btnPesquisar, btnInicio);
    }

    btnPesquisar.addEventListener('click', () => {
        alternarAba(tabSearch, tabFeed, btnPesquisar, btnInicio);
    });
    btnInicio.addEventListener('click', () => {
        alternarAba(tabFeed, tabSearch, btnInicio, btnPesquisar);
    });

    buscaInput.addEventListener("input", () => {
        executarBusca();
    });

    // --- ETAPA 4: BUSCA E RENDERIZAÇÃO DOS CARTÕES EMPILHADOS ---
    async function executarBusca() {
        const termo = buscaInput.value.trim();

        if (termo.length < 2) {
            resultadosDiv.innerHTML = "";
            resultadosDiv.style.display = "none";
            defaultSearchText.style.display = "block";
            return;
        }

        try {
            let urlApi = filtroAtual === 'locais' 
                ? `/api/locais/buscar-criar-post?termo=${encodeURIComponent(termo)}`
                : `/api/usuario/buscar?termo=${encodeURIComponent(termo)}`;

            const resposta = await fetch(urlApi);
            const dados = await resposta.json();

            resultadosDiv.innerHTML = "";

            if (!dados || dados.length === 0) {
                resultadosDiv.style.display = "none";
                defaultSearchText.style.display = "block";
                return;
            }

            defaultSearchText.style.display = "none";

            dados.forEach(itemDado => {
                const itemContainer = document.createElement("div");

                if (filtroAtual === 'locais') {
                    const fotoLocal = itemDado.imagemUrl || '../img/default-local.jpg';
                    const rua = itemDado.rua || itemDado.Rua || "";
                    const numero = itemDado.numero || itemDado.Numero || "s/n";
                    const bairro = itemDado.bairro || itemDado.Bairro || "";
                    const cidade = itemDado.cidade || itemDado.Cidade || "";

                    itemContainer.innerHTML = `
                        <div class="busca-card-conteudo">
                            <img src="${fotoLocal}" class="busca-img-local" alt="${itemDado.nome}">
                            <div class="busca-textos-wrapper">
                                <strong>${itemDado.nome}</strong>
                                <p>${rua} ${numero}, ${bairro} - ${cidade}</p>
                            </div>
                        </div>
                    `;

                    itemContainer.addEventListener("click", () => {
                        buscaInput.value = itemDado.nome;
                        resultadosDiv.innerHTML = "";
                        resultadosDiv.style.display = "none";
                        window.location.href = `/page/detalhes.html?id=${itemDado.id}`;
                    });
                } else {
                    const fotoUsuario = itemDado.fotoPerfilUrl || '../img/default-avatar.jpg';
                    const apelido = itemDado.nickname || "Usuário";

                    itemContainer.innerHTML = `
                        <div class="busca-card-conteudo">
                            <img src="${fotoUsuario}" class="busca-avatar-usuario" alt="${apelido}">
                            <div class="busca-textos-wrapper">
                                <strong>${apelido}</strong>
                                <p>Clique para ver o perfil completo</p>
                            </div>
                        </div>
                    `;

                    itemContainer.addEventListener("click", () => {
                        buscaInput.value = apelido;
                        resultadosDiv.innerHTML = "";
                        resultadosDiv.style.display = "none";
                        window.location.href = `/page/profile.html?usuario=${encodeURIComponent(apelido)}`;
                    });
                }

                resultadosDiv.appendChild(itemContainer);
            });

            resultadosDiv.style.display = "flex"; // Ativa como flexbox vertical para empilhar

        } catch (erro) {
            console.error("Erro ao renderizar:", erro);
        }
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#input-search") && !e.target.closest("#resultados")) {
            resultadosDiv.style.display = "none";
        }
    });
});