using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Esta classe representa a tabela de comentários do sistema. Ela armazena as interações de texto
     * que os usuários fazem dentro de publicações de locais específicos.
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - PerfilController (GET /api/usuario): Conta o total de comentários de cada post no feed do perfil.
     * - PublicacaoController: Vinculado futuramente na listagem de detalhes de posts ou feeds de comentários.
     */

    [Table("comentarios")]
    public class Comentarios
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("publicacao_id")]
        public int PublicacaoId { get; set; }

        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Column("comentario")]
        [MaxLength(100)]        
        public required string Comentario { get; set; }
        
        [Column("data_criacao")]
        public DateTime DataCriacao {get; set; } = DateTime.Now;

        // RELACIONAMENTOS (Chaves Estrangeiras)
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }

        [ForeignKey("PublicacaoId")]
        public virtual Publicacao? Publicacao { get; set; }
    }
}