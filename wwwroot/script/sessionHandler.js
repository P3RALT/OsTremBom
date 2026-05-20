

async function carregarUsuario() {

    const resposta = await fetch("http://localhost:5207/api/auth/me", {
    credentials: "include"
});

    const user = await resposta.json();

    console.log(user);
}

carregarUsuario();