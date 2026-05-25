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
        
        [MaxLength(500)]
        [Column("rua")]
        public string? Rua { get; set; }

        [Column("numero")]
        public int? Numero { get; set; }

        [Column("bairro")]
        public string? Bairro { get; set; }

        [Column("CEP")]
        public int? CEP { get; set; }

        [Column("Cidade")]
        public string? Cidade { get; set; }

        [Column("latitude")]
        public double Latitude { get; set; }

        [Column("longitude")]
        public double Longitude { get; set; }

        [Column("resumo")]
        public required string? Resumo { get; set; }

        [Column("atualizado_em")]
        public DateTime? ResumoAtualizadoEm { get; set; }

        [Column("oq_fazer")]
        public string? OqFazer { get; set; }

        [Column("dicas")]
        public string? Dicas { get; set; }

        [Column("pq_visitar")]
        public string? PqVisitar { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        public virtual ICollection<Publicacao> Publicacoes { get; set; } = new List<Publicacao>();
    }
}