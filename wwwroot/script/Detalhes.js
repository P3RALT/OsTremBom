document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const nomeLocal = document.getElementById('nomeLocal');
    const descricaoLocal = document.getElementById('descricaoLocal');
    const horarioTexto = document.getElementById('horarioTexto');
    const fotoPrincipal = document.getElementById('fotoPrincipal');
    const fotosLaterais = document.getElementById('fotosLaterais');
    const statusAberto = document.getElementById('statusAberto');

    if (!id) {
        if(nomeLocal) nomeLocal.innerText = "ID não encontrado na URL";
        return;
    }

    try {
        // Usando caminho relativo para evitar erro de porta/protocolo
        const resposta = await fetch(`/api/locais/${id}`);

        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }

        const local = await resposta.json();

        // 1. Textos
        nomeLocal.innerText = local.nome || local.Nome;
        descricaoLocal.innerText = local.descricao || local.Descricao;
        horarioTexto.innerText = local.horarioTexto || local.HorarioTexto || "Consulte o local";

        // 2. Imagens
        const url1 = local.imagemUrl || local.ImagemUrl;
        const url2 = local.imagemUrl2 || local.ImagemUrl2 || url1;
        const url3 = local.imagemUrl3 || local.ImagemUrl3 || url1;

        fotoPrincipal.innerHTML = `<img src="${url1}" alt="Foto Principal">`;
        fotosLaterais.innerHTML = `
            <img src="${url2}" alt="Foto 2">
            <img src="${url3}" alt="Foto 3">
        `;

        // 3. Status
        const ativo = local.ativo !== undefined ? local.ativo : local.Ativo;
        statusAberto.innerText = ativo ? "Aberto agora" : "Fechado no momento";
        statusAberto.style.color = ativo ? "#2e7d32" : "#c1351d";


        function renderizarMapa(enderecoDoBanco) {
        const geocoder = new google.maps.Geocoder();
        const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16, });

        geocoder.geocode({ address: enderecoDoBanco }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
            });
            // Atualiza o texto do endereço no HTML
            document.getElementById("enderecoTexto").innerText = results[0].formatted_address;
        } else {
            console.error("Erro ao carregar mapa: " + status);
        }});
    }



    } catch (erro) {
        console.error("Falha na requisição:", erro);
        descricaoLocal.innerHTML = `<span style="color:red">Uai, não conseguimos puxar os dados da API. Verifique se o ID ${id} existe no banco.</span>`;
    }
});