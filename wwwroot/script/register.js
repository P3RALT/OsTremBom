document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-register");
  const form = document.getElementById("registro-form");
  const errorElement = document.getElementById("error");

  const inputsObrigatorios = [
    document.getElementById("nome"),
    document.getElementById("sobrenome"),
    document.getElementById("email"),
  ];

  function validarCamposVazios() {
    const textosOk = inputsObrigatorios.every(el => el.value.trim() !== "");
    btn.disabled = !textosOk;
  }

  inputsObrigatorios.forEach(el => el.addEventListener("input", validarCamposVazios));

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const genero = document.getElementById("genero").value;
    
    const d = parseInt(document.getElementById("day").value);
    const m = parseInt(document.getElementById("month").value);
    const y = parseInt(document.getElementById("year").value);

    if (!d || !m || !y) {
      errorElement.textContent = "Selecione uma data completa.";
      errorElement.style.display = 'block';
      return;
    }

    const hoje = new Date();
    const nascimento = new Date(y, m - 1, d);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const difMes = hoje.getMonth() - nascimento.getMonth();

    if (difMes < 0 || (difMes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 13) {
      errorElement.textContent = "Você precisa ter pelo menos 13 anos.";
      errorElement.style.display = 'block';
      return;
    }

    if (nome.length < 3 || sobrenome.length < 2) {
      errorElement.textContent = "Por favor, digite um nome válido.";
      errorElement.style.display = 'block';
      return;
    }

    errorElement.style.display = 'none';

    const dados = {
      nomeCompleto: `${nome} ${sobrenome}`,
      email,
      genero,
      nascimento: nascimento.toISOString(),
    };

    localStorage.setItem("dadosRegistro", JSON.stringify(dados));
    
    window.location.href = "/page/register2.html";
  });
});