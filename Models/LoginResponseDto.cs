namespace TremBomApi.Models
{
    public class LoginResponseDto
    {
        public string Mensagem { get; set; } = string.Empty;
        public int UsuarioId { get; set; }
        public string NomeCompleto { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FotoPerfilUrl { get; set; }
    }
}