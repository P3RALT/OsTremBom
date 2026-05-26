using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using TremBomApi.Data;
using TremBomApi.Extensions;
using TremBomApi.Models;

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

        /// <summary>
        /// Remove o Like aplicado anteriormente a uma publicação.
        /// </summary>
        
        [HttpPost("{publicacao}/deslike")]
        public async Task<IActionResult> Deslike(int publicacao)
        {
            var publi = await _context.Publicacoes.AnyAsync(p => p.Id == publicacao);
            if (!publi) return NotFound();

            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();

            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.FirstOrDefaultAsync(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao);
            if (jaDeuLike == null)
            {
                return BadRequest("Você não deu like nesse post.");
            }
            _context.Likes.Remove(jaDeuLike);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Like removido com sucesso." });
        }

        /// <summary>
        /// Adiciona um Like a uma publicação específica.
        /// </summary>
        
        [HttpPost("{publicacao}/like")]
        public async Task<IActionResult> Like(int publicacao)
        {
            var publi = await _context.Publicacoes.AnyAsync(p => p.Id == publicacao);
            if (!publi) return NotFound();

            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();

            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.AnyAsync(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao);
            if (jaDeuLike)
            {
                return BadRequest("Você já deu like nesse post.");
            }
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
        
        /// <summary>
        /// Retorna os 10 locais que mais receberam likes nas últimas 24 horas.
        /// </summary>
        
        [HttpGet("trending")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterTrending()
        {
            try
            {
                var limiteData = DateTime.UtcNow.AddDays(-1);

                var locaisTrending = await _context.Likes
                    .Where(l => l.DateLike >= limiteData) 
                    .GroupBy(l => new { 
                        l.Publicacao!.LocalId, 
                        l.Publicacao!.Local!.Nome, 
                        l.Publicacao!.Local!.Categoria 
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

        /// <summary>
        /// Retorna o feed de publicações ordenado por relevância (likes) e data.
        /// </summary>
        
        [HttpGet("feed")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterFeed([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userIdInt = string.IsNullOrEmpty(usuario) ? 0 : int.Parse(usuario);

                // OTIMIZAÇÃO: Consultamos os posts fazendo JOIN direto com Local e Usuário via propriedades de navegação
                var postsBrutos = await _context.Publicacoes
                    .AsNoTracking()
                    .OrderByDescending(p => p.Likes.Count) // Ordenação mais rápida usando propriedades mapeadas
                    .ThenByDescending(p => p.DataPublicacao)
                    .Skip(offset)
                    .Take(limit)
                    .Select(p => new 
                    {
                        id = p.Id,
                        legenda = p.Descricao,
                        localId = p.LocalId,
                        jaCurtiu = userIdInt != 0 && _context.Likes.Any(l => l.UsuarioId == userIdInt && l.PublicacaoId == p.Id),
                        localNome = p.Local!.Nome ?? "Local Desconhecido",
                        localLat = p.Local!.Latitude,
                        localLon = p.Local!.Longitude,
                        localCidade = p.Local!.Cidade ?? "",
                        localLikes = _context.Likes.Count(l => l.Publicacao!.LocalId == p.LocalId),
                        nickname = p.Usuario!.Nickname ?? "usuario",
                        usuarioAvatar = p.Usuario!.FotoPerfilUrl,
                        dataPublicacaoOriginal = p.DataPublicacao,
                        likesCount = p.Likes.Count,
                        // Correção do BUG: Carrega a lista sem invocar métodos em memória do LINQ to Entities
                        fotosUrls = p.Fotos.Select(f => f.FotoUrl).ToList()
                    })
                    .ToListAsync(); 

                // Processamento de formatação final leve executado em memória
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
                    likes = p.likesCount.FormatarQuantidade() // Extensão customizada do seu projeto
                }).ToList();

                return Ok(postsFormatados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Cria uma publicação enviando imagens (via Multipart Form) e registrando coordenadas geográficas.
        /// </summary>
        
        [HttpPost("criar")]
        public async Task<IActionResult> CriarPost(
            [FromForm] List<IFormFile> imagens,
            [FromForm] string descricao,
            [FromForm] string nomeEstabelecimento,
            [FromForm] int? enderecoId,
            [FromForm] string? rua,
            [FromForm] int? numero,
            [FromForm] string? bairro,
            [FromForm] string? cidade)
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usuario)) return Unauthorized();
                if (string.IsNullOrEmpty(nomeEstabelecimento) || string.IsNullOrEmpty(descricao))
                {
                    return BadRequest("Nome do estabelecimento e descrição são obrigatórios.");
                }

                int idLocalFinal = 0;

                if (enderecoId == null || enderecoId <= 0)
                {
                    double? latitude = null;
                    double? longitude = null;

                    if (!string.IsNullOrEmpty(rua))
                    {
                        using (var client = new HttpClient())
                        {
                            client.DefaultRequestHeaders.Add("User-Agent", "OsTremDeBH_Backend/1.0 (email@teste.com)");

                            var ruaCompleta = $"{rua}, {numero}";
                            var cityBusca = !string.IsNullOrEmpty(cidade) ? cidade : "Belo Horizonte";
                            var urlNominatim = $"https://nominatim.openstreetmap.org/search?street={HttpUtility.UrlEncode(ruaCompleta)}&city={HttpUtility.UrlEncode(cityBusca)}&country=Brazil&format=jsonv2&limit=1";

                            try
                            {
                                var respostaMap = await client.GetAsync(urlNominatim);
                                if (respostaMap.IsSuccessStatusCode)
                                {
                                    var jsonString = await respostaMap.Content.ReadAsStringAsync();
                                    using (var doc = JsonDocument.Parse(jsonString))
                                    {
                                        var root = doc.RootElement;
                                        if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() > 0)
                                        {
                                            var primeiroResultado = root[0];
                                            if (primeiroResultado.TryGetProperty("lat", out var latProp) && primeiroResultado.TryGetProperty("lon", out var lonProp))
                                            {
                                                if (double.TryParse(latProp.GetString(), CultureInfo.InvariantCulture, out double lat)) latitude = lat;
                                                if (double.TryParse(lonProp.GetString(), CultureInfo.InvariantCulture, out double lon)) longitude = lon;
                                            }
                                        }
                                    }
                                }
                            }
                            catch (Exception mapEx)
                            {
                                Console.WriteLine($"Erro Nominatim: {mapEx.Message}");
                            }
                        }
                    }

                    var novoLocal = new Local
                    {
                        Nome = nomeEstabelecimento,
                        Rua = rua,
                        Numero = numero,
                        Bairro = bairro,
                        Cidade = !string.IsNullOrEmpty(cidade) ? cidade : "Belo Horizonte",
                        Latitude = latitude ?? 0,
                        Longitude = longitude ?? 0,
                        Resumo = null
                    };

                    _context.Locais.Add(novoLocal);
                    await _context.SaveChangesAsync(); 
                    idLocalFinal = novoLocal.Id; 
                }
                else
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
                            var nomeArquivo = $"{idLocalFinal}-" + Guid.NewGuid() + Path.GetExtension(image.FileName);
                            var caminhoCompleto = Path.Combine(pasta, nomeArquivo);

                            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                            {
                                await image.CopyToAsync(stream);
                            }

                            var urlRelativa = $"/img/posts-imgs/{nomeArquivo}";
                            var imagemPost = new PublicacaoFoto
                            {
                                PublicacaoId = novaPublicacao.Id,
                                FotoUrl = urlRelativa
                            };
                            _context.PublicacoesFotos.Add(imagemPost);
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new { mensagem = "Post processado com sucesso!", publicacaoId = novaPublicacao.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }
    }
}
