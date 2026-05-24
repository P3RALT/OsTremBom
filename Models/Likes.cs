using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("likes")]
    public class Likes
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        public int PublicacaoId { get; set; }

        public int UsuarioId { get; set; }

        [Column("data_like")]

        public DateTime DateLike {get; set;} = DateTime.Now;

        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }

        [ForeignKey("PublicacaoId")]
        public virtual Publicacao? Publicacao { get; set; }

    }
}