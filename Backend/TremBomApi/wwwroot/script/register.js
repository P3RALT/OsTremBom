
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-register");

  const inputs = [
    document.getElementById("nome"),
    document.getElementById("sobrenome"),
    document.getElementById("email"),
  ];

  function validar() {
    const todosPreenchidos = inputs.every(el => el && el.value.trim() !== "");
    btn.disabled = !todosPreenchidos;
  }

  inputs.forEach(el => el.addEventListener("input", validar));

  btn.disabled = true; 
});

document.getElementById("registro-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nomeInput = document.getElementById("nome");
  const nome = nomeInput.value.trim()
  const sobrenomeInput = document.getElementById("sobrenome");
  const sobrenome= sobrenomeInput.value.trim();
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const error = document.getElementById("error");
  const genero = document.getElementById("genero").value;
  const day = parseInt(document.getElementById("day").value);
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);

  if (!day || !month || !year) {
    error.textContent = "Selecione uma data completa.";
    return;
  }

  const hoje = new Date();
  const nascimento = new Date(year, month - 1, day);

  // Validação da idade
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  if (idade < 13) {
    error.textContent = "Você precisa ter pelo menos 13 anos.";
    error.style.display = 'block';
    return;
  }

  // validações básicas
  else if (nome.length < 3 || sobrenome.length < 2 ) {
    error.textContent = "Por favor, digite um nome válido.";
    error.style.display = 'block';
    nomeInput.classList.add('input-erro')
    sobrenomeInput.classList.add('input-erro')
    return;
  }

  // dados em cache
  error.style.display = 'none';
  const nomeCompleto = `${nome} ${sobrenome}`;
  localStorage.setItem("dadosRegistro", JSON.stringify({
    nomeCompleto,
    email,
    genero,
    nascimento,
  }));
  window.location.href = "/page/register2.html";
});