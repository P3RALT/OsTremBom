using System;
using System.Collections.Generic;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Representa as comunidades ou eventos de grupo focados em marcar idas a locais específicos 
     * (recurso muito comum em redes sociais de turismo/rolês).
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - GruposController (POST /api/Grupos): Usado no método 'CriarGrupo' para instanciar novos grupos públicos ou privados.
     */

    public class Grupo
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int LimiteMembros { get; set; }
        public string Privacidade { get; set; } = string.Empty; // "publico" ou "privado"
        public string? Senha { get; set; }
        
        // Relacionamento com Local (Onde o grupo vai se reunir)
        public int? LocalId { get; set; }
        public Local? Local { get; set; }

        // Lista de membros associados ao grupo (Tabela Relacional muitos-para-muitos)
        public List<GrupoMembro> Membros { get; set; } = [];
    }
}