using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Classe central do Feed. Une o usuário que postou ao local comentado, gerenciando o texto da legenda.
     * Contém também a classe complementar PublicacaoFoto para suportar posts com múltiplas imagens.
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - PublicacaoController (GET /feed): Entrega as informações estruturadas da linha do tempo.
     * - PublicacaoController (POST /criar): Salva os dados textuais informados no formulário do front-end.
     */

    [Table("publicacoes")]
    public class Publicacao
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        public int UsuarioId { get; set; }
        public int LocalId { get; set; }    

        [Column("descricao")]
        public required string Descricao { get; set; }

        [Column("data_publicacao")]
        public DateTime DataPublicacao { get; set; } = DateTime.Now;

        // RELACIONAMENTOS (Propriedades de navegação pai)
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
        
        [ForeignKey("LocalId")]
        public virtual Local? Local { get; set; }

        // RELACIONAMENTOS INVERSOS (Filhos) - RESOLVE O ERRO DA CONTROLLER!
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