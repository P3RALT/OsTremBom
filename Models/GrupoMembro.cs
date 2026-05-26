namespace TremBomApi.Models
{
    /*
     * PROPÓSITO DA MODEL:
     * Tabela associativa (Join Table) que resolve o relacionamento de Muitos-para-Muitos (N:N) 
     * entre Usuários e Grupos. Um usuário pode estar em vários grupos, e um grupo tem vários usuários.
     * * PRINCIPAIS ROTAS/FUNÇÕES ATRIBUÍDAS:
     * - GruposController (POST /api/Grupos): Alimentada em laço de repetição no momento do convite de novos integrantes.
     */

    public class GrupoMembro
    {
        public int GrupoId { get; set; }
        public Grupo? Grupo { get; set; }

        public int UsuarioId { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
    }
}