using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("locais")]
    public class Local
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("categoria")]
        public string? Categoria { get; set; }

        [Column("descricao")]
        public string? Descricao { get; set; }

        // --- NOVOS CAMPOS DE INFORMAÇÃO ---
        
        [MaxLength(500)]
        [Column("endereco")]
        public string? Endereco { get; set; }

        [Column("oq_fazer")]
        public string? OqFazer { get; set; }

        [Column("dicas")]
        public string? Dicas { get; set; }

        [Column("pq_visitar")]
        public string? PqVisitar { get; set; }

        // ----------------------------------

        [MaxLength(500)]
        [Column("imagem_url")]
        public string? ImagemUrl { get; set; }

        [MaxLength(500)]
        [Column("imagem_url_2")]
        public string? ImagemUrl2 { get; set; }

        [MaxLength(500)]
        [Column("imagem_url_3")]
        public string? ImagemUrl3 { get; set; }

        [Column("avaliacao_nota")]
        public double AvaliacaoNota { get; set; } 

        [Column("horario_texto")]
        public string? HorarioTexto { get; set; } 

        [Column("total_likes")]
        public int TotalLikes { get; set; }

        [Column("total_comentarios")]
        public int TotalComentarios { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        public virtual ICollection<Publicacao> Publicacoes { get; set; } = new List<Publicacao>();
    }
}