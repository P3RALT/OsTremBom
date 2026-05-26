using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DA DTO:
     * Gerencia a massa de dados enviada pelo formulário de criação de novas contas.
     * Possui validações essenciais de preenchimento obrigatório para proteger a consistência do banco.
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - UsuarioController.cs -> Utilizado no método 'Registrar([FromBody] UsuarioRegisterDto dto)'.
     */

    public class UsuarioRegisterDto
    {
        [Required(ErrorMessage = "O nickname (nome de usuário) é obrigatório.")]
        public string Nickname { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "Insira um endereço de e-mail válido.")]        
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Defina uma senha segura para acesso.")]
        public string Senha { get; set; } = string.Empty;

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public DateTime Aniversario { get; set; }

        [Required(ErrorMessage = "O campo gênero deve ser informado.")]
        public required string Genero { get; set; }
        
        public string? FotoPerfilUrl { get; set; }
        public string? ip { get; set; }
        
        // Coleção de tags de interesses gastronômicos/culturais selecionadas no cadastro
        public List<string> Preferencias { get; set; } = new List<string>();
    }
}