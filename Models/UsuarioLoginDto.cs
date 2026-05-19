using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class UsuarioLoginDto
    {
        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress(ErrorMessage = "E-mail inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória")]
        public string Senha { get; set; } = string.Empty;
        public string? ip { get; set; }
        public string? lat { get; set; }
        public string? lon { get; set; }
    }
}