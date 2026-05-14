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
        horario: document.getElementById('horarioTexto'),
        oqFazer: document.getElementById('oqFazer'),
        fotoPrincipal: document.getElementById('fotoPrincipal'),
        fotosLaterais: document.getElementById('fotosLaterais'),
        status: document.getElementById('statusAberto'),
        statusIcon: document.getElementById('statusIcon'),
        likesCount: document.getElementById('likesCount')
    };

    if (!id) return;

    try {
        const resposta = await fetch(`/api/locais/${id}`);
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const local = await resposta.json();

        // Preenchimento de Textos (Lidando com PascalCase do C# ou camelCase do JSON)
        document.title = local.nome || local.Nome || "Detalhes do Local";
        //elementos.horario.innerText = local.horarioTexto || local.HorarioTexto || "Consulte o local";
        elementos.nome.innerText = local.nome || local.Nome || "Nome do local";
        const ativo = local.ativo !== undefined ? local.ativo : local.Ativo;
        elementos.status.innerText = ativo ? "Aberto agora" : "Fechado no momento";
        elementos.status.style.color = ativo ? "#2e7d32" : "#c1351d";
        elementos.oqFazer.innerText = local.oqFazer || local.OqFazer || "Informação em breve.";
        elementos.pqVisitar.innerText = local.pqVisitar || local.PqVisitar || "Vale a pena conferir!";
        elementos.dicas.innerText = local.dicas || local.Dicas || "Sem dicas no momento.";
        elementos.statusIcon.color = ativo ? "#2e7d32" : "#c1351d";
        elementos.categoria.innerText = local.categoria || local.Categoria || "Categoria desconhecida";
        elementos.endereco.innerText = `${local.rua || local.Rua} ${local.numero || local.Numero}, ${local.bairro || local.Bairro} - ${local.cidade || local.Cidade}` || "Endereço não informado";
        elementos.likesCount.innerText = `${local.totalLikes} likes`;

        /*
        pretendo fazer a descrição ser uma sintese de posts relacionado ao local
        elementos.descricao.innerText = local.descricao || local.Descricao;
        
        
        */
        // Imagens
        const url1 = local.imagemUrl || local.ImagemUrl;
        /* esses links n funcionam mais
        const url2 = local.imagemUrl2 || url1;
        const url3 = local.imagemUrl3 || url1;
        */
       const url2 = url1;
       const url3 = url1;
        elementos.fotoPrincipal.innerHTML = `<img src="${url1}" alt="Foto Principal">`;
        elementos.fotosLaterais.innerHTML = `
            <img src="${url2}" alt="Foto 2">
            <img src="${url3}" alt="Foto 3">
        `;
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