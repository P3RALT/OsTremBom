using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Data;
using TremBomApi.Models;
using TremBomApi.Extensions;
using System.Globalization;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocaisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LocaisController(AppDbContext context) 
        { 
            _context = context;
        }

        [HttpGet("buscar-criar-post")]
        public async Task<IActionResult> Buscar([FromQuery] string termo)
        {
        if (string.IsNullOrWhiteSpace(termo))
            return BadRequest();

        var resultados = await _context.Locais
            .Where(l =>
                l.Nome.ToLower().Contains(termo.ToLower()) ||
                l.Rua!.ToLower().Contains(termo.ToLower()))
            .Take(10)
            .ToListAsync();

        return Ok(resultados);
        }

        // GET: api/locais
        [HttpGet]
        public async Task<IActionResult> ListarTodos()
        {   
            var userLat = User.FindFirst("latitude")?.Value;
            var userLon = User.FindFirst("longitude")?.Value;
            
            // Busca os dados estruturados do banco
            var consultaLocais = await _context.Locais
                .Select(l => new
                {   
                    lat = l.Latitude,
                    lon = l.Longitude,
                    id = l.Id,
                    nome = l.Nome,
                    descricao = "placeholder",
                    categoria = l.Categoria,
                    cidade = l.Cidade ?? "Belo Horizonte",
                    
                    fotosDoBanco = _context.PublicacoesFotos
                        .Where(f => f.Publicacao!.LocalId == l.Id)
                        .OrderBy(f => EF.Functions.Random())
                        .Select(f => f.FotoUrl)
                        .Take(3)
                        .ToArray(), 

                    totalLikes = _context.Likes.Count(like => like.Publicacao!.LocalId == l.Id),
                    totalComentarios = _context.Comentarios.Count(c => c.Publicacao!.LocalId == l.Id)
                })
                .ToListAsync();

            // Calcula as distâncias na memória
            var locaisProcessados = consultaLocais.Select(l => {
                double? distKm = null;
                if (!string.IsNullOrWhiteSpace(userLat) && !string.IsNullOrWhiteSpace(userLon) &&
                    double.TryParse(userLat, System.Globalization.CultureInfo.InvariantCulture, out double uLat) &&
                    double.TryParse(userLon, System.Globalization.CultureInfo.InvariantCulture, out double uLon))
                {
                    distKm = DistanciaExtensions.CalcularDistancia(uLat, uLon, l.lat, l.lon);
                }

                string distanciaTexto = "Distância desconhecida";
                if (distKm.HasValue)
                {
                    distanciaTexto = distKm.Value < 1.0
                        ? $"há {Math.Round(distKm.Value * 1000)} m"
                        : $"há {Math.Round(distKm.Value, 2)} km";
                }

                return new
                {
                    l.id,
                    l.nome,
                    l.descricao,
                    l.categoria,
                    l.cidade,
                    imagemUrl = string.Join(",", l.fotosDoBanco),
                    l.totalLikes,
                    l.totalComentarios,
                    distanciaRaw = distKm, 
                    distancia = distanciaTexto 
                };
            });

            // Sistema de peso (algoritmo)
            // Primeiro ordena por Likes decrescente (Mais curtido no topo).
            // Se empatar nos Likes, ordena por Distância crescente (O mais perto vence o desempate).
            // Se a distância for nula, joga pro final (double.MaxValue).
            var resultadoOrdenado = locaisProcessados
                .OrderByDescending(l => l.totalLikes)
                .ThenBy(l => l.distanciaRaw ?? double.MaxValue);

            // Mapeia para o JSON final limpo para o Front-end
            var resultadoFinal = resultadoOrdenado.Select(l => new {
                l.id,
                l.nome,
                l.descricao,
                l.categoria,
                l.cidade,
                l.imagemUrl,
                l.totalLikes,
                l.totalComentarios,
                l.distancia
            });

            return Ok(resultadoFinal);
        }

        // GET: api/locais/102
        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var local = await _context.Locais.FirstOrDefaultAsync(l => l.Id == id);

            if (local == null)
                return NotFound(new { mensagem = "Local não encontrado" });

            // Só é válido se o resumo NÃO for nulo, a data NÃO for nula E a data for mais recente que 3 dias atrás.
            bool cacheValido = local.ResumoAtualizadoEm != null && 
                       local.ResumoAtualizadoEm > DateTime.UtcNow.AddDays(-3) &&
                       !string.IsNullOrEmpty(local.Resumo) &&
                       !string.IsNullOrEmpty(local.OqFazer) && 
                       !string.IsNullOrEmpty(local.Dicas) && 
                       !string.IsNullOrEmpty(local.PqVisitar);

            string resumo;

            if (cacheValido)
            {
                resumo = local.Resumo!;
            }
            else
            {
                // Se o cache expirou (mais de 7 dias) ou nunca existiu, busca as publicações
                var descricoes = await _context.Publicacoes
                    .Where(p => p.LocalId == id)
                    .Select(p => p.Descricao)
                    .ToListAsync();

                if (descricoes.Any())
                {
                    var texto = string.Join("\n---\n", descricoes);
                    var prompt = $@"
                    Analise as publicações de usuários abaixo sobre o local '{local.Nome}'.

                    Gere um JSON VÁLIDO contendo exatamente as chaves:
                    'Resumo', 'OqFazer', 'Dicas', 'PqVisitar'.

                    REGRAS OBRIGATÓRIAS:
                    - NÃO omitir nenhuma chave.
                    - NÃO retornar texto fora do JSON.
                    - Todos os campos devem ser sempre preenchidos.

                    RESUMO:
                    - Entre 300 e 400 caracteres (OBRIGATÓRIO).
                    - Um único parágrafo sem quebra de linha.
                    - Texto descritivo e natural, sem estilo publicitário exagerado.
                    - Varie o tamanho das frases, mas sem excesso de metáforas.
                    - Termine com ponto final.

                    OqFazer:
                    - Máximo 1 linha.
                    - Texto objetivo, com atividades reais.
                    - Terminar com ponto final.

                    Dicas:
                    - Máximo 1 linha.
                    - Conselhos práticos reais.
                    - Terminar com ponto final.

                    PqVisitar:
                    - Máximo 1 linha.
                    - Motivo direto e claro.
                    - Terminar com ponto final.

                    IMPORTANTE:
                    - Evite frases genéricas de marketing.
                    - Não use linguagem excessivamente poética ou abstrata.

                    Texto das Publicações:
                    {texto}
                    ";
                    ResumoLocalIA resultadoIA = await ChamarIA(prompt);
                    local.Resumo = resultadoIA.Resumo;
                    local.OqFazer = resultadoIA.OqFazer;
                    local.Dicas = resultadoIA.Dicas;
                    local.PqVisitar = resultadoIA.PqVisitar;
                }
                else
                {
                    resumo = "Nenhuma publicação disponível para resumir.";
                }

                // Atualiza a própria entidade que já estava na memória
                local.ResumoAtualizadoEm = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            // Buscas complementares(Likes e Fotos)
            var localLikes = await _context.Likes.CountAsync(like => like.Publicacao!.LocalId == id);

            var fotos = await _context.PublicacoesFotos
                .Where(f => f.Publicacao!.LocalId == id)
                .OrderBy(f => EF.Functions.Random())
                .Select(f => f.FotoUrl)
                .Take(3)
                .ToListAsync();

            // RESPONSE FINAL
            return Ok(new
            {
                local.Id,
                local.Nome,
                local.Rua,
                local.Bairro,
                local.Numero,
                local.Cidade,
                local.Latitude,
                local.Longitude,
                localLikes,
                Fotos = fotos,
                resumoIA = local.Resumo,
                local.OqFazer,
                local.Dicas,
                local.PqVisitar
            });
        }

        // Classe interna para chamar a IA
        private async Task<ResumoLocalIA> ChamarIA(string prompt)
        {
            var client = new HttpClient();
            // Busca na variavel de ambiente ou na configuração a chave da API, para não expor diretamente no código (dotnet user-secrets)
            var configuration = HttpContext.RequestServices.GetService<IConfiguration>();
    
            string apiKey = configuration?["Groq_API"] 
                        ?? Environment.GetEnvironmentVariable("Groq_API") 
                        ?? throw new Exception("Chave da API não encontrada");
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var request = new
            {
                model = "llama-3.3-70b-versatile",
                response_format = new { type = "json_object" }, 
                messages = new[]
                {
                    new {
                        role = "system",
                        content = "Você é um assistente de turismo especializado. Sempre responda em JSON válido. Nunca invente fatos não presentes nos textos. Evite linguagem promocional ou exagerada. Use português correto e objetivo."
                    },
                    new { role = "user", content = prompt }
                }
            };

            var response = await client.PostAsJsonAsync("https://api.groq.com/openai/v1/chat/completions", request);
            if (!response.IsSuccessStatusCode)
            {
                var erroRaw = await response.Content.ReadAsStringAsync();
                throw new Exception($"Erro na API do Groq: {response.StatusCode} - {erroRaw}");
            }   
            var resultadoGroq = await response.Content.ReadFromJsonAsync<GroqResponse>();
    
            string jsonStringFromIA = resultadoGroq?.Choices?.FirstOrDefault()?.Message?.Content ?? "{}";

            var resultadoFinal = System.Text.Json.JsonSerializer.Deserialize<ResumoLocalIA>(jsonStringFromIA, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return resultadoFinal ?? new ResumoLocalIA();
                }
        
    }
        
} 