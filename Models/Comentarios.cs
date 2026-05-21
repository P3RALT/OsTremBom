using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("comentarios")]
    public class Comentarios
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        public int PublicacaoId { get; set; }

        public int UsuarioId { get; set; }
        [Column("comentario")]
        [MaxLength(100)]        
        public required string Comentario {get; set; }

        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }

        [ForeignKey("PublicacaoId")]
        public virtual Publicacao? Publicacao { get; set; }

    }
}