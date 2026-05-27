using System;
using System.Collections.Generic;
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
        
        // CORREÇÃO CRÍTICA: Adicionado o "?" para permitir que um post exista sem local!
        public int? LocalId { get; set; }    

        [Column("descricao")]
        public required string Descricao { get; set; }

        [Column("data_publicacao")]
        public DateTime DataPublicacao { get; set; } = DateTime.Now;

        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
        
        [ForeignKey("LocalId")]
        public virtual Local? Local { get; set; }

        public virtual ICollection<Likes> Likes { get; set; } = new List<Likes>();
        public virtual ICollection<PublicacaoFoto> Fotos { get; set; } = new List<PublicacaoFoto>();
        public virtual ICollection<Comentarios> Comentarios { get; set; } = new List<Comentarios>();
    }

    [Table("publicacoes_fotos")]
    public class PublicacaoFoto
    {
        [Key]
        public int Id { get; set; }
        public int PublicacaoId { get; set; }

        [ForeignKey("PublicacaoId")]
        public virtual Publicacao? Publicacao { get; set; }
        
        [Column("foto_url")]
        public string FotoUrl { get; set; } = string.Empty;
    }
}