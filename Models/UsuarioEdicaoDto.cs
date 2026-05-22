// 1. DTO para receber os dados do formulário de edição
public class UsuarioEdicaoDto
{
    public string FotoPerfilUrl { get; set; }
    public string DescricaoBio { get; set; }
    public System.Collections.Generic.List<string> Preferencias { get; set; }
}

// 2. Rota PUT adicionada dentro do PerfilController
[HttpPut("atualizar")]
public async Task<IActionResult> AtualizarPerfil([FromBody] UsuarioEdicaoDto dto)
{
    // Pega o ID do usuário logado pelo Token JWT
    var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

    var userId = int.Parse(userIdStr);
    
    // Busca o usuário original do banco
    var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == userId);
    if (usuario == null) return NotFound("Usuário não encontrado.");

    // Atualiza os campos apenas se eles forem enviados
    if (!string.IsNullOrEmpty(dto.FotoPerfilUrl))
    {
        usuario.FotoPerfilUrl = dto.FotoPerfilUrl;
    }
    
    usuario.Descricao = dto.DescricaoBio; // Permite deixar em branco se o usuário apagar

    // Atualiza as tags (Preferências)
    if (dto.Preferencias != null)
    {
        usuario.Preferencias.Clear();
        foreach (var pref in dto.Preferencias)
        {
            usuario.Preferencias.Add(pref);
        }
    }

    _context.Usuarios.Update(usuario);
    await _context.SaveChangesAsync();

    return Ok(new { mensagem = "Perfil atualizado com sucesso uai!" });
}