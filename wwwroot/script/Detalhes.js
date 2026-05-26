/**
 * PROPÓSITO DO SCRIPT: Detalhes.js
 * Captura o ID do local enviado via query string da URL, realiza o consumo detalhado da API,
 * injeta textos estruturados e monta mapas geográficos interativos (via biblioteca Leaflet).
 */
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Mapeamento centralizado de ponteiros do DOM para manipulação de texto e mídia
    const elementos = {
        nome: document.getElementById('nomeLocal'),
        descricao: document.getElementById('descricaoLocal'),
        endereco: document.getElementById('enderecoLocal'),
        categoria: document.getElementById('categoria'),
        dicas: document.getElementById('dicas'),
        pqVisitar: document.getElementById('pqVisitar'),
        oqFazer: document.getElementById('oqFazer'),
        likesCount: document.getElementById('likesCount'),
        galeria: document.getElementById("galeria")
    };

    // Se não houver nenhum ID informado nos parâmetros da URL, cancela a operação
    if (!id) return;

    try {
        // CORREÇÃO: Removida rota fixa localhost. Rota relativa funciona em qualquer servidor/porta.
        const resposta = await fetch(`/api/locais/${id}`);
        if (!resposta.ok) throw new Error(`Erro na busca do local: ${resposta.status}`);
        
        const local = await resposta.json();

        // Injeção de textos robusta contendo fallbacks para camelCase e PascalCase do C#
        document.title = local.nome || local.Nome || "Detalhes do Local";
        if (elementos.nome) elementos.nome.innerText = local.nome || local.Nome || "Nome do local";
        if (elementos.oqFazer) elementos.oqFazer.innerText = local.oqFazer || local.OqFazer || "Informação em breve.";
        if (elementos.pqVisitar) elementos.pqVisitar.innerText = local.pqVisitar || local.PqVisitar || "Vale a pena conferir!";
        if (elementos.dicas) elementos.dicas.innerText = local.dicas || local.Dicas || "Sem dicas no momento.";
        if (elementos.categoria) elementos.categoria.innerText = local.categoria || local.Categoria || "Categoria desconhecida";
        
        // Formata o endereço unificado do estabelecimento de forma legível
        if (elementos.endereco) {
            const rua = local.rua || local.Rua || "";
            const numero = local.numero || local.Numero || "S/N";
            const bairro = local.bairro || local.Bairro || "";
            const cidade = local.cidade || local.Cidade || "Belo Horizonte";
            elementos.endereco.innerText = rua ? `${rua}, ${numero} - ${bairro}, ${cidade}` : "Endereço não informado";
        }
        
        // Exibe a contagem de curtidas enviadas da controller
        if (elementos.likesCount) {
            elementos.likesCount.innerText = `${local.localLikes ?? local.LocalLikes ?? 0} likes`;
        }

        // Exibe o bloco de resumo montado pela Inteligência Artificial
        if (elementos.descricao) {
            elementos.descricao.innerText = local.resumoIA || local.resumo || local.Resumo || "Sem resumo disponível.";
        }

        // --- SISTEMA DE RENDERIZAÇÃO DE GALERIA DINÂMICA (MOSAICO) ---
        if (elementos.galeria) {
            const fotos = local.fotos || local.Fotos || [];
            elementos.galeria.className = "galeria-mosaico";

            if (fotos.length === 0) {
                elementos.galeria.innerHTML = `<div class="skeleton-foto"></div>`;
            } else if (fotos.length === 1) {
                elementos.galeria.classList.add("galeria-1");
                elementos.galeria.innerHTML = `<img src="${fotos[0]}" alt="Foto do Local" />`;
            } else if (fotos.length === 2) {
                elementos.galeria.classList.add("galeria-2");
                elementos.galeria.innerHTML = `
                    <img src="${fotos[0]}" alt="Foto 1" />
                    <img src="${fotos[1]}" alt="Foto 2" />`;
            } else {
                elementos.galeria.classList.add("galeria-3");
                elementos.galeria.innerHTML = `
                    <img src="${fotos[0]}" alt="Foto 1" />
                    <img src="${fotos[1]}" alt="Foto 2" />
                    <img src="${fotos[2]}" alt="Foto 3" />`;
            }
        }

        // --- INTEGRAÇÃO DO MAPA GEOGRÁFICO REAL ---
        // Coleta coordenadas geográficas reais retornadas pela nossa API/Nominatim
        const latitude = local.latitude || local.Latitude || -19.932;
        const longitude = local.longitude || local.Longitude || -43.937;

        const mapContainer = document.getElementById("full-map");
        if (mapContainer) {
            const map = L.map("full-map").setView([latitude, longitude], 17);
            
            // Desenha a camada visual do OpenStreetMap no mapa
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Adiciona o marcador estilizado exatamente nas coordenadas do local
            L.circleMarker([latitude, longitude], {
                radius: 10,     
                fillColor: "#069E6E", 
                color: "#fff",       
                weight: 2,           
                opacity: 1,
                fillOpacity: 0.8     
            }).addTo(map);
        }

    } catch (erro) {
        console.error("Falha na requisição detalhada:", erro);
        if (elementos.descricao) {
            elementos.descricao.innerHTML = `<span style="color:red; font-weight:bold;">Uai, não conseguimos resgatar as informações desse local agora.</span>`;
        }
    }
});