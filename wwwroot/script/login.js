document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const form = document.getElementById("login-form");
  const errorElement = document.getElementById("error");
  var lat = null;
  var lon = null;
  var ip = null;
  try{
  const params = new URLSearchParams(window.location.search);
  const data = params.get("ip");
  if (data != null){
    errorElement.textContent = "Conta registrada com sucesso! Faça o login para continuar.";
    errorElement.style.display = 'block';
    errorElement.style.color = "green";
    errorElement.style.backgroundColor = "#069e6e1f";
    errorElement.style.borderRadius = "20px";
    errorElement.style.padding = "10px";
    var lat = params.get("lat");
    var lon = params.get("lon");
    var ip = data;
  }
  }catch(e){}
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

  // Transformamos a função em 'async' para podermos usar o 'await' no fetch
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorElement.style.display = 'none';
    errorElement.style.color = "#ff4d4d";
    errorElement.style.backgroundColor = "#ff4d4d4f";
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errorElement.textContent = "Por favor, insira um e-mail válido.";
      errorElement.style.display = 'block';
      return;
    }

    errorElement.style.display = 'none';

    // 1. Montar o objeto correspondente ao UsuarioLoginDto do C#
    const dadosLogin = {
      email: email,
      senha: senha
    };

    try {
        btnEntrar.disabled = true;
        btnEntrar.querySelector(".btn-text").style.display = "none";
        btnEntrar.querySelector(".btn-loading").style.display = "block";
      // 2. Fazer o disparo para o teu servidor local na porta 5207
      const resposta = await fetch('http://localhost:5207/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
      });
      if (resposta.status === 200) {
        window.location.href = "../page/feed.html";
      } else {
        // Se o C# responder com BadRequest (E-mail ou senha errados)
        errorElement.textContent = resultado.mensagem || "Erro ao realizar o login.";
        errorElement.style.display = 'block';
      }
    } catch (erro) {
      console.error("Erro na conexão com a API:", erro);
      errorElement.textContent = "Não foi possível conectar ao servidor.";
      errorElement.style.display = 'block';
    }
    finally{
        btnEntrar.disabled = false;
        btnEntrar.querySelector(".btn-text").style.display = "block";
        btnEntrar.querySelector(".btn-loading").style.display = "none";
        errorElement.style.display = 'none';
        errorElement.style.color = "#ff4d4d";
        errorElement.style.backgroundColor = "#ff4d4d4f";
    }
  });
});