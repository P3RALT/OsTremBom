using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DA DTO:
     * Captura as credenciais inseridas na tela de login. Além disso, opcionalmente recolhe
     * dados de geolocalização do dispositivo móvel do front-end para embutir nas Claims do Token JWT.
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - UsuarioController.cs -> Utilizado no método de autenticação 'Login([FromBody] UsuarioLoginDto dto)'.
     */

    public class UsuarioLoginDto
    {
        [Required(ErrorMessage = "O e-mail é obrigatório")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória")]
        public string Senha { get; set; } = string.Empty;
        
        public string? ip { get; set; }
        public string? lat { get; set; } // Latitude do usuário capturada via GPS do front-end
        public string? lon { get; set; } // Longitude do usuário capturada via GPS do front-end
    }
}