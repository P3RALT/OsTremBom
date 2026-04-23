document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-register");
  const input = document.getElementById("foto-input");
  const preview = document.getElementById("preview");
  const tags = document.querySelectorAll(".tag");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("conf-senha");
  const error = document.getElementById("error");

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

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const senhaFinal = senhaInput.value.trim();
    // uso da imagem de perfil em breve, necessitamos de um servidor na nuvem para isso.

    // objeto final pronto para ser enviado ao backend
    const finalUser = {
      ...user,
      senha: senhaFinal,
      interesses: [...document.querySelectorAll(".tag.selected")].map(t => t.textContent)
    };
    console.log(finalUser);

    // para limpar --> localStorage.clear()
  });

  btn.disabled = true;
});