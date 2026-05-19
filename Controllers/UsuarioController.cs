using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using TremBomApi.Data; // <-- 1. Adicionado para reconhecer o teu AppDbContext
using System;
using System.Threading.Tasks;
using System.Linq;
using Models;

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

        // --------------------
        // LOGIN 
        // --------------------
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
        // Procura o utilizador na base de dados pelo E-mail
        // Usamos Include(u => u.Sessoes) caso queiras manipular a lista de sessões diretamente
        var usuario = await _context.Usuarios
            .Include(u => u.Sessoes)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        if (usuario == null)
            {
                return BadRequest(new { mensagem = "E-mail ou senha incorretos." });

            }

        // Senha compara a senha com o hash guardado, verifica o trabaho pra ver se as senhas batem
        bool senhaCorreta = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
        
        if (!senhaCorreta)
            {
                return BadRequest(new { message = "E-mail ou senha incorretos." }); 

            }
        // Utiliza dados do usuario 
        usuario.UltimoLogin = DateTime.Now;
        //inicia a sessao
        var novaSessao = new Sessao
        {
        UsuarioId = usuario.Id,
        Token = Guid.NewGuid().ToString(), 
        DataCriacao = DateTime.Now,
        DataExpiracao = DateTime.Now.AddDays(7) 
        };
        usuario.Sessoes.Add(novaSessao);
        // Salvar no Banco de Dados
        await _context.SaveChangesAsync();

        return Ok(new 
    {
        Mensagem = "Login realizado com sucesso!",
        tokenSessao = novaSessao.Token,
        UsuarioId = usuario.Id,
        NomeCompleto = usuario.NomeCompleto,
        Email = usuario.Email,
        FotoPerfilUrl = usuario.FotoPerfilUrl
    });


    }
} }