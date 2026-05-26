using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Data;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class BuscaController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O construtor injeta apenas o contexto necessário para a busca
        public BuscaController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Realiza uma busca unificada por usuários e locais que contenham o termo pesquisado.
        /// </summary>
        /// <param name="name">Termo ou nome a ser pesquisado</param>
        
        [HttpGet("{name}")]
        public async Task<IActionResult> Buscar(string name)
        {
            // Valida se o termo enviado não é vazio ou cheio de espaços
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest(new { mensagem = "O termo de busca não pode ser vazio." });

            // Busca os usuários correspondentes ao termo
            var usuariosQuery = _context.Usuarios
                .Where(u => EF.Functions.Like(u.Nickname, $"%{name}%"))
                .Select(u => new
                {
                    Tipo = "Usuario",
                    Nome = u.Nickname,
                    id = (int?)u.Id, // Mantido o ID real do usuário para navegação no front-end
                    FotoPerfil = u.FotoPerfilUrl,
                    Seguidores = (int?)_context.Seguidores.Count(s => s.AlvoUsuarioId == u.Id),
                    Rua = (string?)null,
                    Bairro = (string?)null,
                    Numero = (int?)null,
                    Cidade = (string?)null
                });

            // Busca os locais correspondentes ao termo
            var locaisQuery = _context.Locais
                .Where(l => EF.Functions.Like(l.Nome, $"%{name}%"))
                .Select(l => new
                {
                    Tipo = "Local",
                    Nome = l.Nome,
                    id = (int?)l.Id,
                    // Otimização: Seleciona a primeira foto disponível de forma direta
                    FotoPerfil = _context.PublicacoesFotos
                        .Where(f => f.Publicacao!.LocalId == l.Id)
                        .Select(f => f.FotoUrl)
                        .FirstOrDefault(),
                    Seguidores = (int?)null,
                    Rua = l.Rua,
                    Bairro = l.Bairro,
                    Numero = l.Numero,
                    Cidade = l.Cidade
                });

            // Une as duas listas na memória/banco de dados e limita aos 10 primeiros resultados
            var resultados = await usuariosQuery
                .Union(locaisQuery)
                .Take(10)
                .ToListAsync();

            return Ok(resultados);
        }
    }
}