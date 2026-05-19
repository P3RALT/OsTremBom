document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-register");
  const input = document.getElementById("foto-input");
  const preview = document.getElementById("preview");
  const tags = document.querySelectorAll(".tag");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("conf-senha");
  const error = document.getElementById("error");

  // Recupera o objeto com nome, sobrenome, email, genero e nascimento da página 1
  const user = JSON.parse(localStorage.getItem("dadosRegistro")) || {};

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  });

  function validarSenha() {
    const senha = senhaInput.value.trim();
    const confirmarSenha = confirmarSenhaInput.value.trim();

    if (senha.length < 6) {
      error.textContent = "Senha precisa ter pelo menos 6 caracteres";
      error.style.display = "block";
      return false;
    }

    if (senha !== confirmarSenha) {
      error.textContent = "As senhas não coincidem.";
      error.style.display = "block";
      return false;
    }

    error.style.display = "none";
    return true;
  }

  function validarTags() {
    return document.querySelectorAll(".tag.selected").length > 0;
  }

  function validarTudo() {
    const senhaOk = validarSenha();
    const tagsOk = validarTags();

    if (!tagsOk) {
      error.textContent = "Selecione ao menos um interesse.";
      error.style.display = "block";
    }

    btn.disabled = !(senhaOk && tagsOk);
  }

  senhaInput.addEventListener("input", validarTudo);
  confirmarSenhaInput.addEventListener("input", validarTudo);

  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("selected");
      validarTudo();
    });
  });

  // Mudamos para async para podermos usar o await no fetch da API
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const senhaFinal = senhaInput.value.trim();

    // Mapeia as tags selecionadas e limpa os emojis (mantém apenas letras e espaços)
    const preferenciasLimpas = [...document.querySelectorAll(".tag.selected")].map(t => {
      return t.textContent.replace(/[^\w\sÀ-ÿ]/g, '').trim();
    });

    // --- AJUSTE: Monta o objeto exatamente igual ao UsuarioRegisterDto do C# ---
    const finalUser = {
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      senha: senhaFinal,
      fotoPerfilUrl: null, // Brevemente integrado com servidor de média
      preferencias: preferenciasLimpas // Mapeado para bater com o C#
    };

    try {
      // Altera a porta (ex: 7123) para a porta real onde a tua API do VS está a rodar
      const resposta = await fetch('http://localhost:5207/api/usuario/registrar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(finalUser)
});

      const resultado = await resposta.json();

      if (resposta.ok) {
        // Limpa o localStorage para que um próximo registo comece do zero
        localStorage.clear();

        // Alerta solicitado que avisa o sucesso do registo
        alert(resultado.mensagem);

        // Redireciona para o index ou ecrã de login
        window.location.href = "../index.html";
      } else {
        // Exibe o erro retornado pela API (Ex: "Email já registrado.")
        error.textContent = resultado.mensagem || "Erro ao registrar usuário.";
        error.style.display = "block";
      }

    } catch (err) {
      console.error("Erro na requisição:", err);
      error.textContent = "Não foi possível conectar ao servidor.";
      error.style.display = "block";
    }
  });
});