using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TremBomApi.Data;
using TremBomApi.Extensions;
using TremBomApi.Models;
using TremBomApi.Models.DTOs;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PublicacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicacaoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{publicacao}/deslike")]
        public async Task<IActionResult> Deslike(int publicacao)
        {
            var publi = await _context.Publicacoes.AnyAsync(p => p.Id == publicacao);
            if (!publi) return NotFound();

            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();

            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.FirstOrDefaultAsync(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao);
            if (jaDeuLike == null) return BadRequest("Você não deu like nesse post.");
            
            _context.Likes.Remove(jaDeuLike);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Like removido com sucesso." });
        }

        [HttpPost("{publicacao}/like")]
        public async Task<IActionResult> Like(int publicacao)
        {
            var publi = await _context.Publicacoes.AnyAsync(p => p.Id == publicacao);
            if (!publi) return NotFound();

            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();

            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.AnyAsync(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao);
            if (jaDeuLike) return BadRequest("Você já deu like nesse post.");
            
            var result = new Likes
            {
                UsuarioId = userInt,
                PublicacaoId = publicacao,
                DateLike = DateTime.UtcNow
            };
            _context.Likes.Add(result);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Like adicionado com sucesso." });
        }
        
        [HttpGet("trending")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterTrending()
        {
            try
            {
                var limiteData = DateTime.UtcNow.AddDays(-1);

                var locaisTrending = await _context.Likes
                    .Where(l => l.DateLike >= limiteData && l.Publicacao != null && l.Publicacao.Local != null) 
                    .GroupBy(l => new { 
                        l.Publicacao.LocalId, 
                        l.Publicacao.Local!.Nome, 
                        l.Publicacao.Local.Categoria 
                    }) 
                    .Select(g => new 
                    {
                        Id = g.Key.LocalId, 
                        Name = g.Key.Nome,
                        categoria = g.Key.Categoria,
                        TotalLikes = g.Count()
                    })
                    .OrderByDescending(x => x.TotalLikes) 
                    .Take(10) 
                    .ToListAsync();

                return Ok(locaisTrending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao obter o trending: {ex.Message}");
            }
        }

        [HttpGet("feed")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterFeed([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userIdInt = string.IsNullOrEmpty(usuario) ? 0 : int.Parse(usuario);

                var postsBrutos = await _context.Publicacoes
                    .AsNoTracking()
                    .OrderByDescending(p => p.Likes.Count) 
                    .ThenByDescending(p => p.DataPublicacao)
                    .Skip(offset)
                    .Take(limit)
                    .Select(p => new 
                    {
                        id = p.Id,
                        legenda = p.Descricao,
                        localId = p.LocalId,
                        jaCurtiu = userIdInt != 0 && _context.Likes.Any(l => l.UsuarioId == userIdInt && l.PublicacaoId == p.Id),
                        localNome = p.Local != null ? p.Local.Nome : "Local Desconhecido",
                        localLat = p.Local != null ? p.Local.Latitude : 0,
                        localLon = p.Local != null ? p.Local.Longitude : 0,
                        localCidade = p.Local != null ? p.Local.Cidade : "",
                        localLikes = p.LocalId != null ? _context.Likes.Count(l => l.Publicacao!.LocalId == p.LocalId) : 0,
                        nickname = p.Usuario!.Nickname ?? "usuario",
                        usuarioAvatar = p.Usuario!.FotoPerfilUrl,
                        dataPublicacaoOriginal = p.DataPublicacao,
                        likesCount = p.Likes.Count,
                        fotosUrls = p.Fotos.Select(f => f.FotoUrl).ToList()
                    })
                    .ToListAsync(); 

                var postsFormatados = postsBrutos.Select(p => new 
                {
                    p.id,
                    p.nickname,
                    p.usuarioAvatar,
                    fotosUrls = p.fotosUrls, 
                    p.legenda,
                    p.localId,
                    p.localCidade,
                    p.localNome,
                    p.localLat,
                    p.localLon,
                    p.localLikes,
                    p.jaCurtiu,
                    dataPublicacao = new DateTimeOffset(p.dataPublicacaoOriginal).ToUnixTimeMilliseconds(),
                    likes = p.likesCount.FormatarQuantidade() 
                }).ToList();

                return Ok(postsFormatados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Cria postagem. Se o endereço não existir na base, o post é criado sem local, evitando sujeira.
        /// </summary>
        [HttpPost("criar")]
        public async Task<IActionResult> CriarPost(
            [FromForm] List<IFormFile> imagens,
            [FromForm] string descricao,
            [FromForm] string nomeEstabelecimento,
            [FromForm] int? enderecoId)
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usuario)) return Unauthorized();
                
                if (string.IsNullOrEmpty(descricao))
                {
                    return BadRequest("A descrição (legenda) da publicação é obrigatória.");
                }

                // Se mandou um ID maior que zero, a gente vincula. Se não, o post fica sem Local!
                int? idLocalFinal = null;
                if (enderecoId.HasValue && enderecoId.Value > 0)
                {
                    idLocalFinal = enderecoId.Value;
                }

                var novaPublicacao = new Publicacao
                {
                    Descricao = descricao,
                    UsuarioId = int.Parse(usuario),
                    LocalId = idLocalFinal, 
                    DataPublicacao = DateTime.UtcNow
                };
                
                _context.Publicacoes.Add(novaPublicacao);
                await _context.SaveChangesAsync();

                string pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "posts-imgs");
                if (!Directory.Exists(pasta)) Directory.CreateDirectory(pasta);

                if (imagens != null && imagens.Count > 0)
                {
                    foreach (var image in imagens)
                    {
                        if (image.Length > 0)
                        {
                            string prefixoLocal = idLocalFinal.HasValue ? idLocalFinal.Value.ToString() : "sem-local";
                            var nomeArquivo = $"{prefixoLocal}-" + Guid.NewGuid() + Path.GetExtension(image.FileName);
                            var caminhoCompleto = Path.Combine(pasta, nomeArquivo);

                            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                            {
                                await image.CopyToAsync(stream);
                            }

                            var urlRelativa = $"/img/posts-imgs/{nomeArquivo}";
                            var imagePost = new PublicacaoFoto
                            {
                                PublicacaoId = novaPublicacao.Id,
                                FotoUrl = urlRelativa
                            };
                            _context.PublicacoesFotos.Add(imagePost);
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new { mensagem = "Post publicado com sucesso!", publicacaoId = novaPublicacao.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno no servidor ao criar post: {ex.Message}");
            }
        }

         [HttpGet("{publicacao}")]
        public async Task<IActionResult> PostInfo(int publicacao)
        {
            try
            {
                var post = await _context.Publicacoes.FirstOrDefaultAsync(p => p.Id == publicacao);
                if (post == null) return NotFound(new { mensagem = "Essa publicação não foi encontrada, uai!" });
                
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userIdInt = string.IsNullOrEmpty(usuario) ? 0 : int.Parse(usuario);
                
                var autor = await _context.Usuarios
                    .Where(u => u.Id == post.UsuarioId)
                    .Select(u => new { u.Nickname, u.FotoPerfilUrl })
                    .FirstOrDefaultAsync();
                
                // Agora funciona perfeitamente, pois a model aceita nulo!
                var localInfo = post.LocalId.HasValue 
                    ? await _context.Locais
                        .Where(l => l.Id == post.LocalId.Value)
                        .Select(l => new { l.Id, l.Nome })
                        .FirstOrDefaultAsync()
                    : null;
                
                var fotos = await _context.PublicacoesFotos
                    .Where(f => f.PublicacaoId == publicacao)
                    .Select(f => f.FotoUrl)
                    .ToListAsync();
                
                var totalLikes = await _context.Likes.CountAsync(l => l.PublicacaoId == publicacao);
                
                var comentarios = await _context.Comentarios
                    .Where(c => c.PublicacaoId == publicacao)
                    .Join(
                        _context.Usuarios, 
                        comentario => comentario.UsuarioId,
                        user => user.Id,        
                        (comentario, user) => new { comentario, user } 
                    )
                    .OrderByDescending(j => j.comentario.DataCriacao) 
                    .Select(j => new
                    {
                        username = j.user.Nickname,    
                        userAvatar = j.user.FotoPerfilUrl,
                        texto = j.comentario.Comentario,
                        tempo = new DateTimeOffset(j.comentario.DataCriacao).ToUnixTimeMilliseconds(),
                    })
                    .ToListAsync();

                var resultado = new
                {
                    id = post.Id,
                    username = autor?.Nickname ?? "usuario", 
                    userAvatar = autor?.FotoPerfilUrl,
                    jaCurtiu = userIdInt != 0 && _context.Likes.Any(l => l.UsuarioId == userIdInt && l.PublicacaoId == post.Id),
                    legenda = post.Descricao,
                    localizacaoNome = localInfo?.Nome ?? "Local Desconhecido", 
                    localizacaoId = localInfo?.Id ?? 0, 
                    dataPublicacao = new DateTimeOffset(post.DataPublicacao).ToUnixTimeMilliseconds(),
                    curtidas = totalLikes,
                    fotos = fotos,
                    comentarios = comentarios
                };

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao carregar os detalhes do post.", erro = ex.Message });
            }
        }

        [HttpPost("{publicacao}/comentario")]
        public async Task<IActionResult> Comentar(int publicacao, [FromBody] ComentarioDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Texto)) return BadRequest("O texto não pode ser vazio, uai!");
            
            var publi = await _context.Publicacoes.Where(p => p.Id == publicacao).FirstOrDefaultAsync();
            if (publi == null) return NotFound();
            
            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();
            
            var novoComentario = new Comentarios
            {
                Comentario = dto.Texto,
                PublicacaoId = publicacao, 
                UsuarioId = int.Parse(usuario),   
            };
            
            _context.Comentarios.Add(novoComentario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Comentário enviado com sucesso!" });
        }
    }
}