using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Gerencia os estabelecimentos e pontos turísticos. Armazena as coordenadas geográficas 
     * e os textos de resumo gerados por inteligência artificial.
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - LocaisController (GET /buscar-criar-post): Utiliza o nome e rua com o operador LIKE.
     * - LocaisController (GET /{id}): Gerencia o cache de resumos alimentado pela API do Groq.
     * - BuscaController (GET /{name}): Une dados de locais e pessoas em uma única busca unificada.
     */

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
        public string? Resumo { get; set; } // Removido o 'required' para permitir cadastro inicial sem IA

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

        // Propriedade de navegação inversa: Permite acessar os posts do local diretamente
        public virtual ICollection<Publicacao> Publicacoes { get; set; } = new List<Publicacao>();
    }
}