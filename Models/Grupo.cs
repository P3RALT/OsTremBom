using System;
using System.Collections.Generic;

namespace TremBomApi.Models
{
    public class Grupo
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int LimiteMembros { get; set; }
        public string Privacidade { get; set; } = string.Empty;
        public string? Senha { get; set; }
        
        // Relacionamento opcional com Local
        public int? LocalId { get; set; }
        public Local? Local { get; set; }

        // Propriedade de navegação para os membros do grupo
        public List<GrupoMembro> Membros { get; set; } = [];
    }
}