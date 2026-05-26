using System.Collections.Generic;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DA DTO:
     * Transporta de forma segura apenas os dados que o usuário tem permissão para alterar
     * na tela de configurações do aplicativo (Biografia, preferências e foto), protegendo campos sensíveis.
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - PerfilController (dentro de UsuarioController.cs) -> Utilizado no método 'AtualizarPerfil([FromBody] UsuarioEdicaoDto dto)'.
     */

    public class UsuarioEdicaoDto
    {
        public string? FotoPerfilUrl { get; set; }
        public string? DescricaoBio { get; set; }
        public List<string>? Preferencias { get; set; }
    }
}