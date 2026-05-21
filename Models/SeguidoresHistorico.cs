using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("seguidores")]
    public class Seguidores
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        // A pessoa que aperta o botão de seguir
        public int UsuarioId { get; set; }

        // O usuario que a pessoa quer seguir
        public int AlvoUsuarioId { get; set; }

        [Column("segueDesde")]
        public DateTime SegueDesde { get; set; } = DateTime.Now;

        [ForeignKey("AlvoUsuarioId")]
        public virtual Usuario? Usuario { get; set; }

        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario2 { get; set; }

    }
}