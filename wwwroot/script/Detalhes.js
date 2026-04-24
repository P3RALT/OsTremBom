document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Mapeamento dos elementos
    const elementos = {
        nome: document.getElementById('nomeLocal'),
        descricao: document.getElementById('descricaoLocal'),
        endereco: document.getElementById('enderecoLocal'),
        oqFazer: document.getElementById('oqFazer'),
        dicas: document.getElementById('dicas'),
        pqVisitar: document.getElementById('pqVisitar'),
        horario: document.getElementById('horarioTexto'),
        fotoPrincipal: document.getElementById('fotoPrincipal'),
        fotosLaterais: document.getElementById('fotosLaterais'),
        status: document.getElementById('statusAberto')
    };

    if (!id) return;

    try {
        const resposta = await fetch(`/api/locais/${id}`);
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);
        const local = await resposta.json();

        // Preenchimento de Textos (Lidando com PascalCase do C# ou camelCase do JSON)
        elementos.nome.innerText = local.nome || local.Nome;
        elementos.descricao.innerText = local.descricao || local.Descricao;
        elementos.endereco.innerText = local.endereco || local.Endereco || "Endereço não informado";
        elementos.oqFazer.innerText = local.oqFazer || local.OqFazer || "Informação em breve.";
        elementos.dicas.innerText = local.dicas || local.Dicas || "Sem dicas no momento.";
        elementos.pqVisitar.innerText = local.pqVisitar || local.PqVisitar || "Vale a pena conferir!";
        elementos.horario.innerText = local.horarioTexto || local.HorarioTexto || "Consulte o local";

        // Imagens
        const url1 = local.imagemUrl || local.ImagemUrl;
        const url2 = local.imagemUrl2 || local.ImagemUrl2 || url1;
        const url3 = local.imagemUrl3 || local.ImagemUrl3 || url1;

        elementos.fotoPrincipal.innerHTML = `<img src="${url1}" alt="Foto Principal">`;
        elementos.fotosLaterais.innerHTML = `
            <img src="${url2}" alt="Foto 2">
            <img src="${url3}" alt="Foto 3">
        `;

        // Status
        const ativo = local.ativo !== undefined ? local.ativo : local.Ativo;
        elementos.status.innerText = ativo ? "Aberto agora" : "Fechado no momento";
        elementos.status.style.color = ativo ? "#2e7d32" : "#c1351d";

    } catch (erro) {
        console.error("Falha na requisição:", erro);
        if(elementos.descricao) elementos.descricao.innerHTML = `<span style="color:red">Erro ao carregar dados.</span>`;
    }
});