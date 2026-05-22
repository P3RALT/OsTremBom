// 1. DTO para receber os dados do formulário de edição
public class UsuarioEdicaoDto
{
    public string? FotoPerfilUrl { get; set; }
    public string? DescricaoBio { get; set; }
    public System.Collections.Generic.List<string>? Preferencias { get; set; }
}

