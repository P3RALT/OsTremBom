namespace TremBomApi.Models
{
    public class GrupoMembro
    {
        public int GrupoId { get; set; }
        public Grupo? Grupo { get; set; }

        public int UsuarioId { get; set; }
        // Se você tiver uma classe Usuario, descomente a linha abaixo:
        // public Usuario? Usuario { get; set; }
    }
}