// Função para alternar entre login e perfil (se o usuário estiver logado)
function loginOrProfile (){
    const apiCall = async () => {
        try {
            const resposta = await fetch("/api/auth/me");
            if (resposta.ok) {
                window.location.href = "/page/profile.html";
                }else{
                window.location.href = "/page/login.html";
                }
            }catch (error) {
                console.error("Erro ao verificar usuário logado:", error);
            }}
        apiCall();
}