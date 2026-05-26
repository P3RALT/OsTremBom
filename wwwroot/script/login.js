document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const form = document.getElementById("login-form");
  const errorElement = document.getElementById("error");
  
  // Variáveis globais do escopo do login
  let lat = null;
  let lon = null;
  let ip = null;

  // Tenta capturar da URL (Fluxo: Veio do Registro)
  try {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("ip");
    if (data != null) {
      errorElement.textContent = "Conta registrada com sucesso! Faça o login para continuar.";
      errorElement.style.display = 'block';
      errorElement.style.color = "green";
      errorElement.style.backgroundColor = "#069e6e1f";
      errorElement.style.borderRadius = "20px";
      errorElement.style.padding = "10px";
      
      lat = params.get("lat");
      lon = params.get("lon");
      ip = data;
    }
  } catch (e) {
    console.error("Erro ao ler parâmetros da URL", e);
  }

  const inputs = [
    document.getElementById("email"),
    document.getElementById("senha")
  ];

  btnEntrar.disabled = true;

  function validarInputs() {
    const todosPreenchidos = inputs.every(el => el.value.trim().length > 0);
    btnEntrar.disabled = !todosPreenchidos;
  }

  inputs.forEach(el => el.addEventListener("input", validarInputs));

  // Função auxiliar para capturar a localização do navegador (Fluxo: Login Direto)
  function obterLocalizacaoNavegador() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocalização não é suportada por este navegador.");
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Usuário negou ou falhou ao obter localização:", error.message);
          resolve(null); // Retorna nulo mas não trava o login
        },
        { timeout: 5000 } // Espera no máximo 5 segundos para não travar o botão
      );
    });
  }

  // Evento de Submit do Formulário
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorElement.style.display = 'none';

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorElement.textContent = "Por favor, insira um e-mail válido.";
      errorElement.style.display = 'block';
      errorElement.style.color = "#ff4d4d";
      errorElement.style.backgroundColor = "#ff4d4d4f";
      return;
    }

    try {
      btnEntrar.disabled = true;
      btnEntrar.querySelector(".btn-text").style.display = "none";
      btnEntrar.querySelector(".btn-loading").style.display = "block";

      // SE NÃO VEIO DA URL, BUSCA DO NAVEGADOR AGORA
      if (!lat || !lon) {
        const geo = await obterLocalizacaoNavegador();
        if (geo) {
          lat = geo.lat;
          lon = geo.lon;
        }
      }

      // Monta o objeto final para a API (enviando número, string ou null)
      const dadosLogin = {
        email: email,
        senha: senha,
        lat: lat ? lat.toString() : null,
        lon: lon ? lon.toString() : null
      };

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
        const resultado = await resposta.json().catch(() => ({}));
        errorElement.textContent = resultado.mensagem || "E-mail ou senha incorretos.";
        errorElement.style.display = 'block';
        errorElement.style.color = "#ff4d4d";
        errorElement.style.backgroundColor = "#ff4d4d4f";
      }
    } catch (erro) {
      console.error("Erro na conexão com a API:", erro);
      errorElement.textContent = "Não foi possível conectar ao servidor.";
      errorElement.style.display = 'block';
    } finally {
      btnEntrar.disabled = false;
      btnEntrar.querySelector(".btn-text").style.display = "block";
      btnEntrar.querySelector(".btn-loading").style.display = "none";
    }
  });
});