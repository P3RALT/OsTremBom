using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    public class GrupoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int LimiteMembros { get; set; }
        public string Privacidade { get; set; } = string.Empty;
        public string? Senha { get; set; }
        public int? LocalId { get; set; }

        // Lista de membros anulável, pois o grupo pode ser criado sem convites iniciais
        public List<int>? MembrosIds { get; set; }
    }
}