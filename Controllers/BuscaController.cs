using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using TremBomApi.Data; // <-- 1. Adicionado para reconhecer o AppDbContext
using System;
using System.Threading.Tasks;
using System.Linq;
using Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using TremBomApi.Extensions;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class BuscaController : ControllerBase
    {
        
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public BuscaController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            
        }
        [HttpGet("{name}")]
        public async Task<IActionResult> Buscar(string name)
        {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest();

        // Busca 10 locais, 10 pessoas e junta em uma lista aleatória usando SQL puro
        var resultados = await _context.Usuarios
            .Where(u => EF.Functions.Like(u.Nickname, $"%{name}%"))
            .Select(u => new
            {
                Tipo = "Usuario",
                Nome = u.Nickname,
                id = (int?)null,
                FotoPerfil = u.FotoPerfilUrl,
                Seguidores =    (int?) _context.Seguidores
                    .Count(s => s.AlvoUsuarioId == u.Id),
                // Isso aq é só pra "burlar" o SQL e conseguir consultar
                Rua = (string?)null,
                Bairro = (string?)null,
                Numero = (int?)null,
                Cidade = (string?)null,
            })
            .Union(
                _context.Locais
                    .Where(l => EF.Functions.Like(l.Nome, $"%{name}%"))
                    .Select(l => new
                    {
                        Tipo = "Local",
                        Nome = l.Nome,
                        id = (int?)l.Id,
                        // Pega uma foto aleatória de uma publicação vinculada ao local
                        FotoPerfil = _context.PublicacoesFotos
                                    .Where(f => f.Publicacao!.LocalId == l.Id)
                                    .OrderBy(f => EF.Functions.Random())
                                    .Select(f => f.FotoUrl)
                                    .FirstOrDefault(),
                        Seguidores = (int?)null,
                        Rua = l.Rua,
                        Bairro = l.Bairro,
                        Numero = l.Numero,
                        Cidade = l.Cidade
                    })
            )
            .Take(10)
            .ToListAsync();

        return Ok(resultados);
        }

        
}}