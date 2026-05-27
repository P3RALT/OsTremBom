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
        
        public string? ImagemUrl { get; set; } // SALVA A IMAGEM EM BASE64
        public int CriadorId { get; set; }     // DONO DO GRUPO

        public int? LocalId { get; set; }
        public Local? Local { get; set; }

        public List<GrupoMembro> Membros { get; set; } = new();
    }
}