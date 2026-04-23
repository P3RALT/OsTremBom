using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Data;
using TremBomApi.Models;

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

        // GET: api/locais
        [HttpGet]
        public async Task<IActionResult> ListarTodos()
        {
            var locais = await _context.Locais.ToListAsync();
            return Ok(locais);
        }

        // GET: api/locais/102
        [HttpGet("{id}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var local = await _context.Locais.FirstOrDefaultAsync(l => l.Id == id);

            if (local == null)
            {
                return NotFound(new { mensagem = "Local não encontrado" });
            }

            return Ok(local);
        }
    }
} 