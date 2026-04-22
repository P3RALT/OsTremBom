using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("usuarios_preferencias")]
    public class UsuarioPreferencia
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("preferencia")]
        public string Preferencia { get; set; } = string.Empty;

        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
    }
}