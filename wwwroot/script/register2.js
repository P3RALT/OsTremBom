document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-register");
  const input = document.getElementById("foto-input");
  const preview = document.getElementById("preview");
  const tags = document.querySelectorAll(".tag");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("conf-senha");
  const error = document.getElementById("error");
  
  let final_ip = "0.0.0.0"; // Como o ipinfo foi removido, iniciamos com um valor padrão amigável
  let final_lat = null;
  let final_lon = null;

  // Recupera o objeto com nickname, email, genero e nascimento da página 1
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

  // FUNÇÃO AUXILIAR: Captura a localização real pelo navegador
  function obterLocalizacaoNavegador() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocalização não é suportada neste navegador.");
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          console.warn("Usuário recusou ou falhou em obter a localização:", err.message);
          resolve(null); // Retorna nulo para não travar o fluxo se ele recusar
        },
        {
          enableHighAccuracy: true, // Força o dispositivo a tentar usar o GPS se disponível
          timeout: 7000             // Aguarda até 7 segundos antes de estourar timeout
        }
      );
    });
  }

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    btn.classList.add("loading");
    btn.disabled = true;
    btn.querySelector(".btn-text").style.display = "none";
    btn.querySelector(".btn-loading").style.display = "flex";
    
    const senhaFinal = senhaInput.value.trim();

    const preferenciasLimpas = [...document.querySelectorAll(".tag.selected")].map(t => {
      return t.textContent.replace(/[^\w\sÀ-ÿ]/g, '').trim();
    });

    // --- TROCA DA API PELO NAVEGADOR AQUI ---
    const geo = await obterLocalizacaoNavegador();
    if (geo) {
      final_lat = geo.lat;
      final_lon = geo.lon;
    }

    // Monta o objeto exatamente igual ao UsuarioRegisterDto do C#
    const finalUser = {
      nickname: user.nickname,
      email: user.email,
      senha: senhaFinal,
      fotoPerfilUrl: null,
      preferencias: preferenciasLimpas,
      genero: user.genero,
      aniversario: user.nascimento,
      lat: final_lat,
      lon: final_lon,
      ip: final_ip
    };

    try {
      const resposta = await fetch('http://localhost:5207/api/usuario/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalUser)
      });

      const resultado = await resposta.json().catch(() => ({}));
      
      if (resposta.ok) {
        // Redireciona passando os parâmetros reais coletados. Se forem null, o encode converte para string "null"
        window.location.replace(`/page/login.html?lat=${encodeURIComponent(finalUser.lat)}&lon=${encodeURIComponent(finalUser.lon)}&ip=${encodeURIComponent(finalUser.ip)}`);
        localStorage.clear();
      } else {
        error.textContent = resultado.mensagem || "Erro ao registrar usuário.";
        error.style.display = "block";
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      error.textContent = "Não foi possível conectar ao servidor.";
      error.style.display = "block";
    } finally {
      btn.classList.remove("loading");
      btn.disabled = false;
      btn.querySelector(".btn-text").style.display = "block";
      btn.querySelector(".btn-loading").style.display = "none";
    }
  });
});