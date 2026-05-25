
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
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
        private readonly IConfiguration _configuration;

        public PublicacaoController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            
        }

        [HttpPost("{publicacao}/deslike")]
        public async Task<IActionResult> Deslike(int publicacao)
        {
            var publi = await _context.Publicacoes.Where(p => p.Id == publicacao).FirstOrDefaultAsync();
            if (publi == null) return NotFound();
            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();


            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.Where(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao).FirstOrDefaultAsync();
            if (jaDeuLike == null)
            {
                return BadRequest("Você não deu like nesse post.");
            }
            _context.Likes.Remove(jaDeuLike);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Like removido com sucesso." });
        }

        [HttpPost("{publicacao}/like")]
        public async Task<IActionResult> Like(int publicacao)
        {
            var publi = await _context.Publicacoes.Where(p => p.Id == publicacao).FirstOrDefaultAsync();
            if (publi == null) return NotFound();
            var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuario)) return Unauthorized();
            var userInt = int.Parse(usuario);
            var jaDeuLike = await _context.Likes.Where(l => l.UsuarioId == userInt && l.PublicacaoId == publicacao).FirstOrDefaultAsync();
            if (jaDeuLike != null)
            {
                return BadRequest("Você já deu like nesse post.");
            }
            var result = new Likes
            {
                UsuarioId = userInt,
                PublicacaoId = publicacao,
            };
            _context.Likes.Add(result);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Like adicionado com sucesso." });
        }
        [HttpGet("feed")]
        [AllowAnonymous]
        public async Task<IActionResult> ObterFeed([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            try
            {
                // Pra lógica de já curtiu ou n, vemos se o usuário tem um id no JWT, se não tive a gente deixa 0
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userIdInt = string.IsNullOrEmpty(usuario) ? 0 : int.Parse(usuario);

                // Busca os dados brutos do banco de dados (Query convertida em SQL válida)
                var postsBrutos = await _context.Publicacoes
                    .AsNoTracking()
                    // Ordena por mais recente dos mais curtidos
                    .OrderByDescending(p => _context.Likes.Count(l => l.PublicacaoId == p.Id))
                    .ThenByDescending(p => p.DataPublicacao)
                    .Skip(offset)
                    .Take(limit)
                    .Select(p => new 
                    {
                        id = p.Id,
                        legenda = p.Descricao,
                        localId = p.LocalId,
                        jaCurtiu = userIdInt != 0 && _context.Likes.Any(l => l.UsuarioId == userIdInt && l.PublicacaoId == p.Id),
                        localNome = _context.Locais.Where(l => l.Id == p.LocalId).Select(l => l.Nome).FirstOrDefault(),
                        localLat = _context.Locais.Where(l => l.Id == p.LocalId).Select(l => l.Latitude).FirstOrDefault(),
                        localLon =  _context.Locais.Where(l => l.Id == p.LocalId).Select(l => l.Longitude).FirstOrDefault(),
                        localCidade = _context.Locais.Where(l => l.Id == p.LocalId).Select(l => l.Cidade).FirstOrDefault(),
                        localLikes = _context.Likes.Count(l => l.Publicacao!.LocalId == p.LocalId),
                        // Dados do Dono do Post
                        nickname = p.Usuario!.Nickname, 
                        usuarioAvatar = p.Usuario.FotoPerfilUrl, 
                        dataPublicacaoOriginal = p.DataPublicacao,
                        // Pega todas as fotos relacionadas ao post
                        fotosUrls = _context.PublicacoesFotos
                                            .Where(img => img.PublicacaoId == p.Id)
                                            .Select(img => img.FotoUrl)
                                            .ToList(),


                        likesCount = _context.Likes.Count(l => l.PublicacaoId == p.Id),
                    })
                    .ToListAsync();

                // Transforma/Formata na memória (LINQ to Objects) antes de enviar para o Front-end
                var postsFormatados = postsBrutos.Select(p => new 
                {
                    p.id,
                    p.nickname,
                    p.usuarioAvatar,
                    p.fotosUrls,
                    p.legenda,
                    p.localId,
                    p.localCidade,
                    p.localNome,
                    p.localLat,
                    p.localLon,
                    p.localLikes,
                    p.jaCurtiu,
                    dataPublicacao = new DateTimeOffset(p.dataPublicacaoOriginal).ToUnixTimeMilliseconds(),
                    likes = p.likesCount.FormatarQuantidade(),
                }).ToList();

                return Ok(postsFormatados);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar feed: {ex.Message}");
                return StatusCode(500, "Erro interno no servidor.");
            }
        }
        

        [HttpPost("criar")]
        public async Task<IActionResult> CriarPost(
            [FromForm] List<IFormFile> imagens,
            [FromForm] string descricao,
            [FromForm] string nomeEstabelecimento,
            [FromForm] int? enderecoId,
            // Campos adicionais do formulário para quando for um local novo
            [FromForm] string? rua,
            [FromForm] int? numero,
            [FromForm] string? bairro,
            [FromForm] string? cidade)
        {
            try
            {
                var usuario = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usuario)) return Unauthorized();
                // Validação básica de segurança
                if (string.IsNullOrEmpty(nomeEstabelecimento) || string.IsNullOrEmpty(descricao))
                {
                    return BadRequest("Nome do estabelecimento e descrição são obrigatórios.");
                }

                int idLocalFinal = 0;

                // Opção 1: Não veio ID do front-end, precisamos cadastrar)
                if (enderecoId == null || enderecoId <= 0)
                {
                    double? latitude = null;
                    double? longitude = null;

                    // Busca as coordenadas no Nominatim se houver nome da rua
                    if (!string.IsNullOrEmpty(rua))
                    {
                        using (var client = new HttpClient())
                        {
                            // Identificação obrigatória exigida pela política do Nominatim
                            client.DefaultRequestHeaders.Add("User-Agent", "OsTremDeBH_Backend/1.0 (email@teste.com)");

                            var ruaCompleta = $"{rua}, {numero}";
                            var cidadeBusca = !string.IsNullOrEmpty(cidade) ? cidade : "Belo Horizonte";

                            var urlNominatim = $"https://nominatim.openstreetmap.org/search?street={HttpUtility.UrlEncode(ruaCompleta)}&city={HttpUtility.UrlEncode(cidadeBusca)}&country=Brazil&format=jsonv2&limit=1";

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

                                            if (primeiroResultado.TryGetProperty("lat", out var latProp) && 
                                                primeiroResultado.TryGetProperty("lon", out var lonProp))
                                            {
                                                if (double.TryParse(latProp.GetString(), CultureInfo.InvariantCulture, out double lat))
                                                    latitude = lat;
                                                
                                                if (double.TryParse(lonProp.GetString(), CultureInfo.InvariantCulture, out double lon))
                                                    longitude = lon;
                                            }
                                        }
                                    }
                                }
                            }
                            catch (Exception mapEx)
                            {
                                Console.WriteLine($"Erro ao consultar o Nominatim: {mapEx.Message}");
                                return BadRequest("Erro ao consultar o Nominatim.");
                            }
                        }
                    }

                    // Instancia o novo local com os dados recebidos e as coordenadas achadas
                    var novoLocal = new Local
                    {
                        Nome = nomeEstabelecimento,
                        Rua = rua,
                        Numero = numero,
                        Resumo = null,
                        Bairro = bairro,
                        Cidade = !string.IsNullOrEmpty(cidade) ? cidade : "Belo Horizonte",
                        Latitude = latitude??0,
                        Longitude = longitude??0,
                    };

                    _context.Locais.Add(novoLocal);
                    await _context.SaveChangesAsync(); // Salva para gerar o ID automático
                    
                    idLocalFinal = novoLocal.Id; 
                }
                // Opção 2: LOCAL EXISTENTE (O usuário selecionou um local já salvo da lista)
                else
                {
                    idLocalFinal = enderecoId.Value;
                }

                // SALVAR A PUBLICAÇÃO 
                var novaPublicacao = new Publicacao
                {
                    Descricao = descricao,
                    UsuarioId = int.Parse(usuario),
                    LocalId = idLocalFinal, // Vincula ao ID
                };
                _context.Publicacoes.Add(novaPublicacao);
                await _context.SaveChangesAsync();

                // SALVAR AS IMAGENS NO DISCO E REGISTRAR NO BANCO
                var caminhosImagens = new List<string>();
                string pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "posts-imgs");

                if (!Directory.Exists(pasta))
                    Directory.CreateDirectory(pasta);

                if (imagens != null && imagens.Count > 0)
                {
                    foreach (var imagem in imagens)
                    {
                        if (imagem.Length > 0)
                        {
                            var nomeArquivo = $"{idLocalFinal}-" + Guid.NewGuid() + Path.GetExtension(imagem.FileName);
                            var caminhoCompleto = Path.Combine(pasta, nomeArquivo);

                            using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                            {
                                await imagem.CopyToAsync(stream);
                            }

                            var urlRelativa = $"/img/posts-imgs/{nomeArquivo}";
                            caminhosImagens.Add(urlRelativa);

                            // Cria a referência da imagem no banco atrelada à publicação
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

                return Ok(new
                {
                    mensagem = "Post e local processados com sucesso!",
                    publicacaoId = novaPublicacao.Id,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno no servidor: {ex.Message}");
            }
        }
    }
}