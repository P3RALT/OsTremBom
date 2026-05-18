const fotoInput = document.getElementById('foto-input');
const mainPreview = document.getElementById('preview');
const thumbContainer = document.getElementById('thumbnail-container');
const btnPrev = document.getElementById('prev-photo');
const btnNext = document.getElementById('next-photo');
const buttonSubmit = document.getElementById('btn-postar');
const tags = document.querySelectorAll('.tag');
const descricaoInput = document.getElementById('descricao');
const nomeEstabelecimentoInput = document.getElementById('nome-estabelecimento');

let imagesArray = [];
let currentIndex = 0;

function validarFormulario() {
    const descricao = descricaoInput.value.trim();
    const nomeEstabelecimento = nomeEstabelecimentoInput.value.trim();
    const tagSelecionada = document.querySelector('.tag.selected');
    const temImagens = imagesArray.length > 0;

    if (descricao !== "" && nomeEstabelecimento !== "" && tagSelecionada && temImagens) {
        buttonSubmit.disabled = false;
    } else {
        buttonSubmit.disabled = true;
    }
}

descricaoInput.addEventListener('input', validarFormulario);
nomeEstabelecimentoInput.addEventListener('input', validarFormulario);

tags.forEach(tag => {
    tag.addEventListener('click', () => {
        tags.forEach(t => t.classList.remove('selected'));
        tag.classList.add('selected');
        validarFormulario();
    });
});

fotoInput.addEventListener('change', function() {
    const files = Array.from(this.files);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (files.length > 0) {
        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert(`O arquivo "${file.name}" não é válido.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const url = e.target.result;
                imagesArray.push(url);
                const newIndex = imagesArray.length - 1;

                const imgThumb = document.createElement('img');
                imgThumb.src = url;
                imgThumb.classList.add('thumb-item');
                imgThumb.onclick = () => updatePreview(newIndex);
                thumbContainer.appendChild(imgThumb);

                if (imagesArray.length === 1) updatePreview(0);
                
                validarFormulario();
            }
            reader.readAsDataURL(file);
        });
    }
    this.value = "";
});

function updatePreview(index) {
    if (imagesArray.length === 0) return;
    currentIndex = index;
    mainPreview.src = imagesArray[currentIndex];
    document.querySelectorAll('.thumb-item').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
    });
}

btnNext.onclick = (e) => {
    e.preventDefault();
    if (imagesArray.length === 0) return;
    currentIndex = (currentIndex + 1) % imagesArray.length;
    updatePreview(currentIndex);
};

btnPrev.onclick = (e) => {
    e.preventDefault();
    if (imagesArray.length === 0) return;
    currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
    updatePreview(currentIndex);
};

const buscaInput = document.getElementById("nome-estabelecimento");
const resultadosDiv = document.getElementById("resultados");

buscaInput.addEventListener("input", async () => {

    const termo = buscaInput.value.trim();

    if (termo.length < 2) {
        resultadosDiv.innerHTML = "";
        resultadosDiv.style.display = "none";
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
            return;
        }

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

                console.log("Selecionado:", local);
            });

            resultadosDiv.appendChild(item);
        });

        resultadosDiv.style.display = "block";

    } catch (erro) {
        console.error(erro);
    }
});
document.addEventListener("click", (e) => {

    if (!e.target.closest("#nome-estabelecimento") &&
        !e.target.closest("#resultados")) {

        resultadosDiv.style.display = "none";
    }

});