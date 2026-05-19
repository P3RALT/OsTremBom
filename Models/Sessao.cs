using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("sessoes")]
    public class Sessao
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Required]
        [MaxLength(500)]
        [Column("token")]
        public string Token { get; set; } = string.Empty;

        [Column("data_criacao")]
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        [Column("data_expiracao")]
        public DateTime? DataExpiracao { get; set; }

        [Column("ip")]
        public string? Ip { get; set; }

        [Column("Latitude")]
        public double? latitude { get; set; }

        [Column("Longitude")]
        public double? longitude { get; set; }

        [ForeignKey(nameof(UsuarioId))] 
        public virtual Usuario? Usuario { get; set; }
    }
}