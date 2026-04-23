async function carregarLocaisCarrossel() {
    const container = document.getElementById('carrossel-locais');

    try {
        // 1. Faz a chamada para a sua API .NET
        const response = await fetch('http://localhost:5207/api/locais'); // Ajuste a porta se necessário
        
        if (!response.ok) throw new Error("Erro ao buscar dados da API");

        const locais = await response.json();

        // 2. Limpa o container (caso tenha algo escrito lá)
        container.innerHTML = '';

        // 3. Loop para criar cada item do carrossel
       locais.forEach(local => {
    const card = document.createElement('div');
    card.className = 'Card';

    card.innerHTML = `
        <div class="card-image">
            <button class="btn-favorito" onclick="favoritar(${local.id}, event)">♡</button>
            <img src="${local.imagemUrl || '../img/default-bh.jpg'}" alt="${local.nome}">
        </div>
        <div class="card-content">
            <div class="card-rating">
                <span>●●●●●</span> (1)
            </div>
            <h3>${local.nome}</h3>
            <p class="card-category">${local.categoria}</p>
            <button class="btn-reservar" onclick="verDetalhes(${local.id})">Ver mais</button>
        </div>
    `;
    container.appendChild(card);
});

// Função para não abrir os detalhes ao clicar no coração
function favoritar(id, event) {
    event.stopPropagation();
    alert("Local " + id + " adicionado aos favoritos!");
}

    } catch (error) {
        console.error("Erro:", error);
        container.innerHTML = `<p>Uai, deu um erro ao carregar os trens: ${error.message}</p>`;
    }
}

// Inicia a função assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarLocaisCarrossel);

// Função extra para o botão (exemplo)
function verDetalhes(id) {
    window.location.href = `../page/detalhes.html?id=${id}`;
}