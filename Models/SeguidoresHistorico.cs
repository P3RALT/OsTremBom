using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Gerencia o sistema de conexões da rede social (Quem segue quem). Armazena as chaves de 
     * Usuário origem (seguidor) e Usuário destino (alvo).
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - PerfilController (POST /seguir e DELETE /unfollow): Modifica as linhas dessa tabela.
     * - PerfilController (GET /seguidores e /seguindo): Realiza Joins para exibir as listagens nas telas de perfil.
     */

    [Table("seguidores")]
    public class Seguidores
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Column("alvo_usuario_id")]
        public int AlvoUsuarioId { get; set; }

        [Column("segueDesde")]
        public DateTime SegueDesde { get; set; } = DateTime.Now;

        // RELACIONAMENTOS (Mapeados de forma explícita para evitar conflito de chaves do mesmo tipo)
        [ForeignKey("AlvoUsuarioId")]
        public virtual Usuario? AlvoUsuario { get; set; }

        [ForeignKey("UsuarioId")]
        public virtual Usuario? SeguidorUsuario { get; set; }
    }
}