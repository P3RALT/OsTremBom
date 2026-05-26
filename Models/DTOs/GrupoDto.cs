using System;
using System.Collections.Generic;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DA DTO:
     * Objeto de entrada de dados para criação ou edição de grupos de rolês. Ela coleta os
     * dados básicos do formulário e uma lista de IDs de usuários para gerar os convites iniciais.
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - GruposController.cs -> Utilizado no método 'CriarGrupo([FromBody] GrupoDto dto)'.
     */

    public class GrupoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int LimiteMembros { get; set; }
        public string Privacidade { get; set; } = string.Empty; // "publico" ou "privado"
        public string? Senha { get; set; }
        public int? LocalId { get; set; }

        // Lista de IDs dos usuários que o criador deseja convidar no momento da criação do grupo
        public List<int>? MembrosIds { get; set; }
    }
}