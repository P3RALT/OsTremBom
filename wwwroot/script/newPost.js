const fotoInput = document.getElementById('foto-input');
const mainPreview = document.getElementById('preview');
const previewIcon = document.getElementById('preview-icon');
const btnDeletar = document.getElementById('btn-deletar-foto');
const thumbContainer = document.getElementById('thumbnail-container');
const btnPrev = document.getElementById('prev-photo');
const btnNext = document.getElementById('next-photo');
const buttonSubmit = document.getElementById('btn-postar');
const btnCriarLocalSubmit = document.getElementById("btnCriarLocalSubmit");
const descricaoInput = document.getElementById('descricao');
const nomeEstabelecimentoInput = document.getElementById('nome-estabelecimento');
let cepEndereco = document.getElementById("cepEndereco");
let enderecoTemp = null;
let enderecoId = null;
let imagesArray = [];
let arquivosReaisArray = []; // Essa aq guarda a versão final das imagens
let currentIndex = 0;

const inputsObrigatorios = {
    nomeEndereco: document.getElementById("nomeEndereco"),
    cep: document.getElementById("cepEndereco"),
    numero: document.getElementById("numeroEndereco"),
    rua: document.getElementById("ruaEndereco")
};

function validarCamposVazios() {
    const textosOk = Object.values(inputsObrigatorios)
        .every(el => el.value.trim() !== "");
    btnCriarLocalSubmit.disabled = !textosOk;
}

function validarFormulario() {
    const descricao = descricaoInput.value.trim();
    const nomeEstabelecimento = nomeEstabelecimentoInput.value.trim();
    const temImagens = imagesArray.length > 0;

    if (descricao !== "" && nomeEstabelecimento !== "" && temImagens) {
        buttonSubmit.disabled = false;
    } else {
        buttonSubmit.disabled = true;
    }
}


buttonSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    buttonSubmit.disabled = true;
    
    const formData = new FormData();

    // Envia os dados básicos obrigatórios do Post
    formData.append("descricao", descricaoInput.value.trim());
    formData.append("nomeEstabelecimento", buscaInput.value.trim());
    formData.append("enderecoId", enderecoId || 0); // Envia 0 se for local novo

    // Se for um local inédito criado pelo modal, passa os blocos de endereço para o C#
    if (!enderecoId && enderecoTemp) {
        formData.append("rua", enderecoTemp.logradouro || inputsObrigatorios.rua.value.trim());
        formData.append("numero", inputsObrigatorios.numero.value.trim());
        formData.append("bairro", enderecoTemp.bairro || "");
        formData.append("cidade", enderecoTemp.localidade || "Belo Horizonte");
    }

    // Adiciona os arquivos físicos de imagem ao FormData
    arquivosReaisArray.forEach(file => {
        formData.append("imagens", file);
    });

    try {
        const resposta = await fetch("/api/publicacao/criar", {
            method: "POST",
            body: formData,
        });

        if (resposta.ok) {
            const resultado = await resposta.json();
            window.location.href = `../page/feed.html?id=${resultado.publicacaoId}`;

            //!
        } else {
            const erroTexto = await resposta.text();
            alert(`Erro na resposta do servidor: ${erroTexto}`);
        }

    } catch (err) {
        console.error("Erro de conexão ao salvar a publicação:", err);
    }
    finally {
        buttonSubmit.disabled = false;
    }
});

// Botão submit do modal de criar local
btnCriarLocalSubmit.addEventListener("click", function(e){
    e.preventDefault();
    enderecoTemp = {
        ...enderecoTemp,
        numero: inputsObrigatorios.numero.value,
        nomeLocal: document.getElementById("nomeEndereco").value,
    };
    buscaInput.value = enderecoTemp.nomeLocal;
    enderecoId = null; // Garante que é um local novo se o modal foi usado
    fecharModalGrupo();
    validarFormulario();
});

// Inputs do modal de local
descricaoInput.addEventListener('input', validarFormulario);
nomeEstabelecimentoInput.addEventListener('input', validarFormulario);

// Formatar o CEP
inputsObrigatorios.cep.addEventListener("input", async (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.slice(0, 8);

    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d+)/, "$1-$2");
    }

    e.target.value = valor;

    if (valor.length == 9) {
        const cepLimpo = valor.replace(/\D/g, "");
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (resposta.ok) {
                const resultado = await resposta.json();
                enderecoTemp = resultado;
                if (resultado.erro) {
                    alert("Por favor, digite um CEP válido.");
                } else {
                    inputsObrigatorios.rua.value = resultado.logradouro;
                }
            }
        } catch(e) {
            alert(`Não foi possível se conectar com a API, tente novamente mais tarde. Error: ${e}`);
        }
    }
});

// Listener do input de fotos
fotoInput.addEventListener('change', function() {
    const files = Array.from(this.files);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (files.length > 0) {
        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert(`O arquivo "${file.name}" não é válido.`);
                return;
            }

            // Guardamos o arquivo real aq
            arquivosReaisArray.push(file);

            const reader = new FileReader();
            reader.onload = function(e) {
                const url = e.target.result;
                imagesArray.push(url);
                
                renderThumbnails();
                if (imagesArray.length === 1) updatePreview(0);
                validarFormulario();
            }
            reader.readAsDataURL(file);
        });
    }
    this.value = ""; 
});
function renderThumbnails() {
    thumbContainer.innerHTML = "";
    imagesArray.forEach((url, index) => {
        const imgThumb = document.createElement('img');
        imgThumb.src = url;
        imgThumb.classList.add('thumb-item');
        if (index === currentIndex) imgThumb.classList.add('active');
        imgThumb.onclick = () => updatePreview(index);
        thumbContainer.appendChild(imgThumb);
    });
}

function updatePreview(index) {
    if (imagesArray.length === 0) {
        mainPreview.style.display = "none";
        previewIcon.style.display = "block";
        btnDeletar.style.display = "none";
        btnNext.style.display = "none";
        btnPrev.style.display = "none";
        return;
    }
    btnNext.style.display = "block";
    btnPrev.style.display = "block";
    mainPreview.style.display = "block";
    previewIcon.style.display = "none";
    btnDeletar.style.display = "block";

    currentIndex = index;
    mainPreview.src = imagesArray[currentIndex];
    
    document.querySelectorAll('.thumb-item').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
    });
}

btnDeletar.onclick = (e) => {
    e.preventDefault();
    if (imagesArray.length === 0) return;

    imagesArray.splice(currentIndex, 1);
    arquivosReaisArray.splice(currentIndex, 1); 

    if (currentIndex >= imagesArray.length && imagesArray.length > 0) {
        currentIndex = imagesArray.length - 1;
    }

    renderThumbnails();
    updatePreview(currentIndex);
    validarFormulario();
};

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

// Lógica de busca de locais para o post
buscaInput.addEventListener("input", async () => {
    const termo = buscaInput.value.trim();
    if (termo.length < 2) {
        resultadosDiv.innerHTML = "";
        resultadosDiv.style.display = "none";
        return;
    }
    try {
        const resposta = await fetch(`/api/locais/buscar-criar-post?termo=${encodeURIComponent(termo)}`);
        const locais = await resposta.json();
        resultadosDiv.innerHTML = "";
        
        if (locais.length === 0) {
            const item = document.createElement("div");
            item.classList.add("resultado-item");
            item.innerHTML = `
                <strong>Criar novo local</strong>
                <p>Não foi possível achar o local que você queria. Não se preocupe, crie ele agora mesmo e contribua com o crescimento da nossa comunidade.</p>
            `;
            item.addEventListener("click", () => {
                const modal = document.getElementById('modalCriarGrupo');
                if (modal) {
                    modal.classList.add('active');
                    Object.values(inputsObrigatorios)
                        .forEach(el => el.addEventListener("input", validarCamposVazios));
                    validarCamposVazios();
                }
            });
            resultadosDiv.appendChild(item);
            return;
        }
        
        locais.forEach(local => {
            const item = document.createElement("div");
            item.classList.add("resultado-item");
            item.innerHTML = `
                <strong>${local.nome}</strong>
                <p>${local.rua || local.Rua} ${local.numero || local.Numero}, ${local.bairro || local.Bairro} - ${local.cidade || local.Cidade}</p>
            `;
            item.addEventListener("click", () => {
                buscaInput.value = local.nome;
                resultadosDiv.innerHTML = "";
                resultadosDiv.style.display = "none";
                enderecoId = local.id; // Vincula o ID do local existente
                validarFormulario();
            });
            resultadosDiv.appendChild(item);
        });
        resultadosDiv.style.display = "block";
    } catch (erro) {
        console.error(erro);
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest("#nome-estabelecimento") && !e.target.closest("#resultados")) {
        resultadosDiv.style.display = "none";
    }
});

function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo').reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
    }
}