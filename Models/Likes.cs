using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Registra as curtidas efetuadas nas publicações dos usuários. Essencial para calcular o algoritmo de engajamento.
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - PublicacaoController (POST /{id}/like e /deslike): Adiciona ou remove registros desta tabela.
     * - PublicacaoController (GET /trending): Agrupa curtidas por data para montar o ranking dos locais mais quentes.
     */

    [Table("likes")]
    public class Likes
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        public int PublicacaoId { get; set; }

        public int UsuarioId { get; set; }

        [Column("data_like")]
        public DateTime DateLike { get; set; } = DateTime.UtcNow; // Otimizado para UtcNow padrão internacional

        // RELACIONAMENTOS (Propriedades de navegação)
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }

        [ForeignKey("PublicacaoId")]
        public virtual Publicacao? Publicacao { get; set; }
    }
}