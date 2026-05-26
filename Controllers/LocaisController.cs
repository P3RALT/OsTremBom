using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using TremBomApi.Data;
using TremBomApi.Models;
using TremBomApi.Models.DTOs;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocaisController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // Injetando o IConfiguration de forma nativa no construtor da classe
        public LocaisController(AppDbContext context, IConfiguration configuration) 
        { 
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Busca locais filtrando por Nome ou Rua de forma performática.
        /// </summary>
        [HttpGet("buscar-criar-post")]
        public async Task<IActionResult> Buscar([FromQuery] string termo)
        {
            if (string.IsNullOrWhiteSpace(termo))
                return BadRequest(new { mensagem = "O termo de busca não pode ser nulo." });

            // OTIMIZAÇÃO: Substituído ToLower().Contains por EF.Functions.Like para preservar o uso de índices no Banco
            var resultados = await _context.Locais
                .Where(l => EF.Functions.Like(l.Nome, $"%{termo}%") || 
                            EF.Functions.Like(l.Rua!, $"%{termo}%"))
                .Take(10)
                .ToListAsync();

            return Ok(resultados);
        }

        /// <summary>
        /// Lista todos os locais cadastrados na base de dados.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> ListarTodos()
        {
            var locais = await _context.Locais.AsNoTracking().ToListAsync();
            return Ok(locais);
        }

        /// <summary>
        /// Busca detalhes de um local por ID e atualiza/gera informações via IA (Groq) se o cache expirar.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var local = await _context.Locais.FirstOrDefaultAsync(l => l.Id == id);

            if (local == null)
                return NotFound(new { mensagem = "Local não encontrado" });

            // Validação de Cache (Válido se atualizado nos últimos 3 dias e com campos preenchidos)
            bool cacheValido = local.ResumoAtualizadoEm != null && 
                               local.ResumoAtualizadoEm > DateTime.UtcNow.AddDays(-3) &&
                               !string.IsNullOrEmpty(local.Resumo) &&
                               !string.IsNullOrEmpty(local.OqFazer) && 
                               !string.IsNullOrEmpty(local.Dicas) && 
                               !string.IsNullOrEmpty(local.PqVisitar);

            if (!cacheValido)
            {
                // Busca as publicações vinculadas para abastecer o prompt da IA
                var descricoes = await _context.Publicacoes
                    .Where(p => p.LocalId == id)
                    .Select(p => p.Descricao)
                    .ToListAsync();

                if (descricoes.Any())
                {
                    var texto = string.Join("\n---\n", descricoes);
                    var prompt = $@"
                    Analise as publicações de usuários abaixo sobre o local '{local.Nome}'.
                    Gere um JSON VÁLIDO contendo exatamente as chaves: 'Resumo', 'OqFazer', 'Dicas', 'PqVisitar'...
                    Texto das Publicações: {texto}";

                    // Chama a IA e atualiza as propriedades do local
                    ResumoLocalIA resultadoIA = await ChamarIA(prompt);
                    local.Resumo = resultadoIA.Resumo;
                    local.OqFazer = resultadoIA.OqFazer;
                    local.Dicas = resultadoIA.Dicas;
                    local.PqVisitar = resultadoIA.PqVisitar;
                }
                else
                {
                    local.Resumo = "Nenhuma publicação disponível para resumir.";
                }

                local.ResumoAtualizadoEm = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            // Buscas complementares de engajamento
            var localLikes = await _context.Likes.CountAsync(like => like.Publicacao!.LocalId == id);

            var fotos = await _context.PublicacoesFotos
                .Where(f => f.Publicacao!.LocalId == id)
                .OrderBy(f => EF.Functions.Random()) // Seleção aleatória via Banco de dados
                .Select(f => f.FotoUrl)
                .Take(3)
                .ToListAsync();

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
                LocalLikes = localLikes,
                Fotos = fotos,
                resumoIA = local.Resumo,
                local.OqFazer,
                local.Dicas,
                local.PqVisitar
            });
        }

        // Método auxiliar privado para comunicação com a API do Groq
        private async Task<ResumoLocalIA> ChamarIA(string prompt)
        {
            using var client = new HttpClient();
            
            string apiKey = _configuration["Groq_API"] 
                            ?? Environment.GetEnvironmentVariable("Groq_API") 
                            ?? throw new Exception("Chave da API Groq_API não encontrada.");
            
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var request = new
            {
                model = "llama-3.3-70b-versatile",
                response_format = new { type = "json_object" }, 
                messages = new[]
                {
                    new { role = "system", content = "Você é um assistente de turismo especializado. Responda em JSON válido." },
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