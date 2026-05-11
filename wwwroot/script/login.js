document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const form = document.getElementById("login-form");
  const errorElement = document.getElementById("error");

  const inputs = [
    document.getElementById("email"),
    document.getElementById("senha")
  ];

  btnEntrar.disabled = true;

  function validarInputs() {
    const todosPreenchidos = inputs.every(el => el.value.trim().length > 0);
    
    if (todosPreenchidos) {
      btnEntrar.disabled = false;
    } else {
      btnEntrar.disabled = true;
    }
  }

  inputs.forEach(el => el.addEventListener("input", validarInputs));

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errorElement.textContent = "Por favor, insira um e-mail válido.";
      errorElement.style.display = 'block';
      return;
    }


    errorElement.style.display = 'none';
    console.log("Tentativa de login com:", email);


    window.location.href = "/page/profile.html";
  });
});