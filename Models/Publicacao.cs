using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("publicacoes")]
    public class Publicacao
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int LocalId { get; set; }
        
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
        [ForeignKey("LocalId")]
        public virtual Local? Local { get; set; }
    }

    [Table("publicacoes_fotos")]
    public class PublicacaoFoto
    {
        [Key]
        public int Id { get; set; }
        public string FotoUrl { get; set; } = string.Empty;
    }
}