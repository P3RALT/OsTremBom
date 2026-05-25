document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Mapeamento dos elementos
    const elementos = {
        nome: document.getElementById('nomeLocal'),
        descricao: document.getElementById('descricaoLocal'),
        endereco: document.getElementById('enderecoLocal'),
        categoria: document.getElementById('categoria'),
        dicas: document.getElementById('dicas'),
        pqVisitar: document.getElementById('pqVisitar'),
        oqFazer: document.getElementById('oqFazer'),
        fotoPrincipal: document.getElementById('fotoPrincipal'),
        fotosLaterais: document.getElementById('fotosLaterais'),
        likesCount: document.getElementById('likesCount')
    };

    if (!id) return;

    try {
        const resposta = await fetch(`/api/locais/${id}`);
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const local = await resposta.json();

        // Preenchimento de Textos (Lidando com PascalCase do C# ou camelCase do JSON)
        document.title = local.nome || local.Nome || "Detalhes do Local";
        elementos.nome.innerText = local.nome || local.Nome || "Nome do local";
        const ativo = local.ativo !== undefined ? local.ativo : local.Ativo;
        elementos.oqFazer.innerText = local.oqFazer || local.OqFazer || "Informação em breve.";
        elementos.pqVisitar.innerText = local.pqVisitar || local.PqVisitar || "Vale a pena conferir!";
        elementos.dicas.innerText = local.dicas || local.Dicas || "Sem dicas no momento.";
        elementos.categoria.innerText = local.categoria || local.Categoria || "Categoria desconhecida";
        elementos.endereco.innerText = `${local.rua || local.Rua} ${local.numero || local.Numero}, ${local.bairro || local.Bairro} - ${local.cidade || local.Cidade}` || "Endereço não informado";
        elementos.likesCount.innerText = `${local.localLikes} likes`;

        elementos.descricao.innerText = local.resumoIA;
        const galeria = document.getElementById("galeria");
        const fotos = local.fotos ?? [];

        galeria.className = "galeria-mosaico";

        if (fotos.length === 0) {
            galeria.innerHTML = `<div class="skeleton-foto"></div>`;
        }

        else if (fotos.length === 1) {
            galeria.classList.add("galeria-1");

            galeria.innerHTML = `
                <img src="${fotos[0]}" />
            `;
        }

        else if (fotos.length === 2) {
            galeria.classList.add("galeria-2");

            galeria.innerHTML = `
                <img src="${fotos[0]}" />
                <img src="${fotos[1]}" />
            `;
        }

        else {
            galeria.classList.add("galeria-3");

            galeria.innerHTML = `
                <img src="${fotos[0]}" />
                <img src="${fotos[1]}" />
                <img src="${fotos[2]}" />
            `;
        }
        // Latitude e longitude aleatórias por enquanto, precisamos converter o endereço para coordenadas geográficas usando uma API de geocoding
        const latitude = local.latitude || local.Latitude || -19.932;
        const longitude = local.longitude || local.Longitude || -43.937;

        const map = L.map("full-map").setView([latitude, longitude], 17);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.circleMarker([latitude, longitude], {
            radius: 10,     
            fillColor: "#069E6E", 
            color: "#fff",       
            weight: 2,           
            opacity: 1,
            fillOpacity: 0.8     
        }).addTo(map);


    } catch (erro) {
        console.error("Falha na requisição:", erro);
        if(elementos.descricao) elementos.descricao.innerHTML = `<span style="color:red">Erro ao carregar dados.</span>`;
    }
});