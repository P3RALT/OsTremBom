using System.Collections.Generic;

namespace TremBomApi.Models.DTOs
{
    public class GrupoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int LimiteMembros { get; set; }
        public string Privacidade { get; set; } = string.Empty; 
        public string? Senha { get; set; }
        public string? ImagemUrl { get; set; } // RECEBE DO FRONT-END
        public int? LocalId { get; set; }
        public List<int>? MembrosIds { get; set; }
    }
}