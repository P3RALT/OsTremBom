using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using TremBomApi.Data; // <-- 1. Adicionado para reconhecer o teu AppDbContext
using System;
using System.Threading.Tasks;
using System.Linq;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class UsuarioController : ControllerBase
    {
        // 2. Usando o teu contexto real: AppDbContext
        private readonly AppDbContext _context;

        // 3. O construtor recebe o teu AppDbContext por injeção
        public UsuarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioRegisterDto dto)
        {
            // Validação: Verifica se o e-mail inserido já existe na tabela de Usuários
            var emailExistente = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (emailExistente)
            {
                return BadRequest(new { mensagem = "Email já registrado." });
            }

            // Segurança: Transforma a senha em texto limpo num Hash seguro usando o BCrypt
            string senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

            // Mapeamento: Cria a entidade Usuario com os dados recebidos do formulário
            var novoUsuario = new Usuario
            {
                NomeCompleto = $"{dto.Nome} {dto.Sobrenome}".Trim(), 
                Email = dto.Email,
                SenhaHash = senhaCriptografada,
                FotoPerfilUrl = dto.FotoPerfilUrl ?? "../images/default-profile.png",
                DataCadastro = DateTime.Now,
                TermosAceitosEm = DateTime.Now
            };

            // Preferências: Loop para adicionar cada interesse selecionado ao utilizador
            foreach (var pref in dto.Preferencias) 
            {
                novoUsuario.Preferencias.Add(new UsuarioPreferencia 
                { 
                    Preferencia = pref 
                });
            }

            // Adiciona o novo utilizador ao DbSet correto e salva no Banco de Dados
            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();

            // Resposta de Sucesso que o teu JavaScript vai ler e mostrar o Alert!
            return Ok(new
            {
                mensagem = "Usuário registrado com sucesso!",
                usuarioId = novoUsuario.Id,
                nomeCompleto = novoUsuario.NomeCompleto
            });
        }
    }
}