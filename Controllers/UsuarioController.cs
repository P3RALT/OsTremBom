using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using TremBomApi.Models.DTOs;
using TremBomApi.Data;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TremBomApi.Extensions;
using Microsoft.AspNetCore.Authorization; 

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/usuario")] 
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _pepper = "PePpErSeCrEto123!@#"; 

        public UsuarioController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Registra um novo usuário criptografando a senha com BCrypt + Pepper de segurança.
        /// </summary>
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioRegisterDto dto)
        {
            var usuarioExistente = await _context.Usuarios
                .AnyAsync(u => u.Email == dto.Email || u.Nickname == dto.Nickname);
            
            if (usuarioExistente)
            {
                return BadRequest(new { mensagem = "E-mail ou Nickname já cadastrados no sistema." });
            }
            string ipDoUsuario = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "0.0.0.0";

            string senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(dto.Senha + _pepper);

            var novoUsuario = new Usuario
            {
                Nickname = dto.Nickname,
                Email = dto.Email,
                SenhaHash = senhaCriptografada,
                FotoPerfilUrl = dto.FotoPerfilUrl ?? "../img/default-avatar.jpg",
                Genero = dto.Genero,
                IpRegistro = ipDoUsuario,
                Aniversario = dto.Aniversario,
                DataCadastro = DateTime.Now,
                UltimoLogin = DateTime.Now
            };

            if (dto.Preferencias != null)
            {
                foreach (var pref in dto.Preferencias) 
                {
                    novoUsuario.Preferencias.Add(pref);
                }
            }

            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();
            return Created(string.Empty, new { mensagem = "Usuário registrado com sucesso!" });
        }
        
        /// <summary>
        /// Realiza a autenticação do usuário emitindo um Cookie seguro HTTPOnly contendo o Token JWT.
        /// </summary>
        [HttpPost("login")]  
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (usuario == null)
            {
                return BadRequest(new { mensagem = "E-mail ou senha incorretos." });
            }

            bool senhaCorreta = BCrypt.Net.BCrypt.Verify(dto.Senha + _pepper, usuario.SenhaHash);
            if (!senhaCorreta)
            {
                return BadRequest(new { message = "E-mail ou senha incorretos." }); 
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var chaveSecreta = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim("latitude", dto.lat??"".ToString()),
                    new Claim("longitude", dto.lon??"".ToString()),
                    new Claim("nickname", usuario.Nickname)
                }),
                Expires = DateTime.UtcNow.AddDays(1), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(chaveSecreta), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var tokenObj = tokenHandler.CreateToken(tokenDescriptor);
            string jwtToken = tokenHandler.WriteToken(tokenObj);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("JwtToken", jwtToken, cookieOptions);
            
            usuario.UltimoLogin = DateTime.Now;
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            
            return Ok(new { mensagem = "Login efetuado com sucesso!" });
        }

        /// <summary>
        /// Coleta os dados completos de perfil da conta autenticada logada.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetUsuarioLogado([FromQuery] bool logado = false)
        {
            if (!logado) return BadRequest("Parâmetro 'logado=true' obrigatório.");

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId)) 
                return Unauthorized();

            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (usuario == null) return NotFound();

            var ultimasPublicacoes = await _context.Publicacoes
                .AsNoTracking()
                .Where(p => p.UsuarioId == usuario.Id)
                .OrderByDescending(p => p.DataPublicacao)
                .Take(10)
                .Select(p => new
                {
                    id = p.Id,
                    fotoUrl = p.Fotos.Select(f => f.FotoUrl).FirstOrDefault(),
                    likes = p.Likes.Count.FormatarQuantidade(),
                    comentarios = _context.Comentarios.Count(c => c.PublicacaoId == p.Id).FormatarQuantidade()
                })
                .ToListAsync();
            
            var totalSeguidores = await _context.Seguidores.CountAsync(s => s.AlvoUsuarioId == usuario.Id);
            var totalSeguindo = await _context.Seguidores.CountAsync(s => s.UsuarioId == usuario.Id);
            var totalPublicacoes = await _context.Publicacoes.CountAsync(p => p.UsuarioId == usuario.Id);

            return Ok(new
            {
                id = usuario.Id,
                seguindo = totalSeguindo.FormatarQuantidade(),
                seguidores = totalSeguidores.FormatarQuantidade(),
                nickname = usuario.Nickname,
                fotoPerfilUrl = usuario.FotoPerfilUrl,
                usuario.Preferencias,
                descricaoBio = usuario.Descricao,
                usuario.Aniversario,
                vistoPorUltimo = usuario.UltimoLogin,
                isOwner = true,
                publicacoesCount = totalPublicacoes.FormatarQuantidade(),
                publicacoes = ultimasPublicacoes
            });
        }

        /// <summary>
        /// Realiza o logout, removendo o cookie de autenticação do navegador.
        /// </summary>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("JwtToken");
            return Ok(new { mensagem = "Logout efetuado com sucesso!" });
        }

        /// <summary>
        /// Atualiza informações parciais de perfil (Biografia e Preferências).
        /// </summary>
        [HttpPut("atualizar")]
        [Authorize]
        public async Task<IActionResult> AtualizarPerfil([FromBody] UsuarioEdicaoDto dto)
        {
            try 
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr)) return Unauthorized("Sessão inválida.");

                var userId = int.Parse(userIdStr);
                
                // CORREÇÃO AQUI: Removido o .Include(u => u.Preferencias) para evitar erro no EF Core.
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Id == userId);
                    
                if (usuario == null) return NotFound("Usuário não cadastrado.");

                if (!string.IsNullOrEmpty(dto.FotoPerfilUrl)) 
                {
                    usuario.FotoPerfilUrl = dto.FotoPerfilUrl;
                }
                
                usuario.Descricao = dto.DescricaoBio; 

                // Atualização segura das preferências para uma propriedade mapeada em banco
                if (dto.Preferencias != null)
                {
                    if (usuario.Preferencias != null)
                    {
                        usuario.Preferencias.Clear();
                    }
                    else 
                    {
                        // Se por algum motivo a lista estava null no objeto C#, a gente instancia ela antes
                        usuario.Preferencias = new System.Collections.Generic.List<string>();
                    }

                    foreach (var pref in dto.Preferencias) 
                    {
                        usuario.Preferencias.Add(pref);
                    }
                }

                _context.Usuarios.Update(usuario);
                await _context.SaveChangesAsync();
                
                return Ok(new { mensagem = "Perfil atualizado com sucesso uai!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    mensagem = "Erro interno no servidor ao salvar.", 
                    detalhe = ex.InnerException?.Message ?? ex.Message 
                });
            }
        }

        /// <summary>
        /// Segue uma conta de usuário.
        /// </summary>
        [HttpPost("seguir/{name}")]
        [Authorize]
        public async Task<IActionResult> SeguirUsuario(string name)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound();

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();

            var parsedUserIdStr = int.Parse(userIdStr);
            if (parsedUserIdStr == usuario.Id) return BadRequest("Você não pode seguir a si mesmo.");

            var jaSegue = await _context.Seguidores.AnyAsync(s => s.UsuarioId == parsedUserIdStr && s.AlvoUsuarioId == usuario.Id);
            if (jaSegue) return BadRequest("Você já segue essa conta.");

            var novoSeguidor = new Seguidores { AlvoUsuarioId = usuario.Id, UsuarioId = parsedUserIdStr };
            _context.Seguidores.Add(novoSeguidor);
            await _context.SaveChangesAsync();
            return Ok(new { mensagem = "Conta seguida com sucesso." });
        }

        /// <summary>
        /// Deixa de seguir uma conta (Unfollow).
        /// </summary>
        [HttpDelete("unfollow/{name}")]
        [Authorize]
        public async Task<IActionResult> UnfollowUsuario(string name)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound();

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null) return Unauthorized();

            var parsedUserIdStr = int.Parse(userIdStr);
            
            var registro = await _context.Seguidores
                .FirstOrDefaultAsync(s => s.UsuarioId == parsedUserIdStr && s.AlvoUsuarioId == usuario.Id);
            
            if (registro == null) return BadRequest("Você não segue este usuário.");

            _context.Seguidores.Remove(registro);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// Obtém a lista dos últimos posts curtidos por um usuário específico.
        /// </summary>
        [HttpGet("{name}/curtidos")]
        public async Task<IActionResult> GetCurtidosUsuario(string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest("Nome não informado.");
            
            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound();

            var likesBrutos = await _context.Likes
                .AsNoTracking()
                .Where(l => l.UsuarioId == usuario.Id)
                .OrderByDescending(l => l.DateLike) 
                .Take(10)
                .Select(l => new
                {
                    publicacaoId = l.PublicacaoId,
                    fotoUrl = l.Publicacao!.Fotos.Select(f => f.FotoUrl).FirstOrDefault(),
                    likesCount = l.Publicacao.Likes.Count,
                    comentariosCount = _context.Comentarios.Count(c => c.PublicacaoId == l.PublicacaoId)
                })
                .ToListAsync();

            var formatados = likesBrutos.Select(p => new
            {
                id = p.publicacaoId,
                fotoUrlPublicacao = p.fotoUrl,
                likes = p.likesCount.FormatarQuantidade(),
                comentarios = p.comentariosCount.FormatarQuantidade()
            }).ToList();

            return Ok(formatados);
        }

        /// <summary>
        /// Obtém dados de um perfil público baseado no apelido (Nickname).
        /// </summary>
        [HttpGet("{name}")]
        public async Task<IActionResult> GetUsuarioPorNome(string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest("Nome não informado.");

            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound();

            var totalSeguidores = await _context.Seguidores.CountAsync(s => s.AlvoUsuarioId == usuario.Id);
            var totalSeguindo = await _context.Seguidores.CountAsync(s => s.UsuarioId == usuario.Id);
            var totalPublicacoes = await _context.Publicacoes.CountAsync(p => p.UsuarioId == usuario.Id);

            var ultimasPublicacoes = await _context.Publicacoes
                .AsNoTracking()
                .Where(p => p.UsuarioId == usuario.Id)
                .OrderByDescending(p => p.DataPublicacao)
                .Take(10)
                .Select(p => new
                {
                    id = p.Id,
                    fotoUrl = p.Fotos.Select(f => f.FotoUrl).FirstOrDefault(),
                    likes = p.Likes.Count.FormatarQuantidade(),
                    comentarios = _context.Comentarios.Count(c => c.PublicacaoId == p.Id).FormatarQuantidade()
                })
                .ToListAsync();

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            bool ehODonoDoPerfil = !string.IsNullOrEmpty(userIdStr) && userIdStr == usuario.Id.ToString();
            
            bool segue = false;
            if (!string.IsNullOrEmpty(userIdStr) && int.TryParse(userIdStr, out int loggedId))
            {
                segue = await _context.Seguidores.AnyAsync(s => s.UsuarioId == loggedId && s.AlvoUsuarioId == usuario.Id);
            }

            return Ok(new
            {
                id = usuario.Id,
                seguindo = totalSeguindo.FormatarQuantidade(),
                seguidores = totalSeguidores.FormatarQuantidade(),
                nickname = usuario.Nickname,
                fotoPerfilUrl = usuario.FotoPerfilUrl,
                usuario.Preferencias,
                descricaoBio = usuario.Descricao,
                usuario.Aniversario,
                vistoPorUltimo = usuario.UltimoLogin,
                isOwner = ehODonoDoPerfil,
                publicacoesCount = totalPublicacoes.FormatarQuantidade(),
                publicacoes = ultimasPublicacoes,
                segue = segue
            });
        }

        /// <summary>
        /// Retorna a lista de todos os grupos vinculados a um usuário específico.
        /// </summary>
        [HttpGet("{name}/grupos")]
        public async Task<IActionResult> GetGruposUsuario(string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest("Nome não informado.");

            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound("Usuário não cadastrado no sistema.");

            var gruposDoUsuario = await _context.Grupos
                .AsNoTracking()
                .Include(g => g.Local)  
                .Include(g => g.Membros) 
                .Where(g => g.CriadorId == usuario.Id || g.Membros.Any(m => m.UsuarioId == usuario.Id))
                .OrderByDescending(g => g.Id) 
                .ToListAsync();

            return Ok(gruposDoUsuario);
        }

        /// <summary>
        /// Retorna a lista de seguidores de um perfil.
        /// </summary>
        [HttpGet("{name}/seguidores")]
        public async Task<IActionResult> GetSeguidores(string name)
        {
            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound("Usuário não encontrado.");

            var lista = await _context.Seguidores
                .AsNoTracking()
                .Where(s => s.AlvoUsuarioId == usuario.Id)
                .Select(s => new {
                    Nickname = s.SeguidorUsuario!.Nickname,
                    FotoPerfilUrl = s.SeguidorUsuario.FotoPerfilUrl
                }).ToListAsync();

            return Ok(lista);
        }

        /// <summary>
        /// Retorna a lista de quem o perfil selecionado está seguindo.
        /// </summary>
        [HttpGet("{name}/seguindo")]
        public async Task<IActionResult> GetSeguindo(string name)
        {
            var usuario = await _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null) return NotFound("Utilizador não encontrado.");

            var lista = await _context.Seguidores
                .AsNoTracking()
                .Where(s => s.UsuarioId == usuario.Id)
                .Select(s => new
                {
                    nickname = s.AlvoUsuario!.Nickname,
                    fotoPerfilUrl = s.AlvoUsuario.FotoPerfilUrl
                })
                .ToListAsync();

            return Ok(lista);
        }
    }}