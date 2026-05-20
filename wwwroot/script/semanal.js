// Função para abrir o modal de criação de grupo
function abrirModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.add('active');
    }
}

// Função para fechar o modal
function fecharModalGrupo() {
    const modal = document.getElementById('modalCriarGrupo');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('formCriarGrupo').reset();
        document.getElementById('container-senha-grupo').style.display = 'none';
    }
}

// Monitora o select de privacidade para exibir ou ocultar a senha
function tratarMudancaPrivacidade() {
    const selectPrivacidade = document.getElementById('grupoPrivacidade');
    const containerSenha = document.getElementById('container-senha-grupo');
    const inputSenha = document.getElementById('grupoSenha');

    if (selectPrivacidade.value === 'privado') {
        containerSenha.style.display = 'block';
        inputSenha.setAttribute('required', 'required'); // Torna obrigatório se for privado
    } else {
        containerSenha.style.display = 'none';
        inputSenha.removeAttribute('required'); // Remove a obrigatoriedade
        inputSenha.value = ''; // Limpa o campo
    }
}

// Simulação de envio (Pronto para o seu fetch do Backend futuramente)
function salvarGrupo(event) {
    event.preventDefault();
    
    // Captura dos dados (Exemplo estruturado para uso posterior)
    const dadosGrupo = {
        nome: document.getElementById('grupoNome').value,
        descricao: document.getElementById('grupoDescricao').value,
        limiteMembros: document.getElementById('grupoLimite').value,
        privacidade: document.getElementById('grupoPrivacidade').value,
        senha: document.getElementById('grupoSenha').value
    };

    console.log("Dados prontos para enviar à API:", dadosGrupo);
    
    // Aqui entrará seu código fetch para a TremBomApi
    alert('Grupo criado com sucesso! (Simulação)');
    fecharModalGrupo();
}