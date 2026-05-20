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

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class UsuarioController : ControllerBase
    {
        // 2. Usando o contexto real: AppDbContext
        
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // Segurança²:  Usa um "pepper" (uma string secreta fixa) para adicionar uma camada extra de proteção contra ataques de força bruta
        string pepper  = "PePpErSeCrEto123!@#"; // ((Em produção a gente esconde isso, mas já q é um trabalho, a gente releva))

        // 3. O construtor recebe o AppDbContext por injeção
        public UsuarioController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioRegisterDto dto)
        {
            // Validação: Verifica se o e-mail inserido já existe na tabela de Usuários

            // vou mudar essa verificação pra ser feita no JavaScript também
            var usuarioExistente = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email || u.Nickname == dto.Nickname);
            if (usuarioExistente != null)
            {
                if (usuarioExistente.Email == dto.Email)
                    return BadRequest(new { mensagem = "Email já registrado." });
                    
                if (usuarioExistente.Nickname == dto.Nickname)
                    return BadRequest(new { mensagem = "Nickname já registrado." });
            }
            // Segurança: Transforma a senha em texto limpo num Hash seguro usando o BCrypt


            string senhaCriptografada = BCrypt.Net.BCrypt.HashPassword(dto.Senha + pepper);

            // Mapeamento: Cria a entidade Usuario com os dados recebidos do formulário
            var novoUsuario = new Usuario
            {
                Nickname = dto.Nickname,
                Email = dto.Email,
                SenhaHash = senhaCriptografada,
                FotoPerfilUrl = dto.FotoPerfilUrl ?? "../img/default-avatar.jpg",
                Genero = dto.Genero,
                IpRegistro = dto.ip,
                Aniversario = dto.Aniversario,
                DataCadastro = DateTime.Now,
                UltimoLogin = DateTime.Now
            };

            // Preferências: Loop para adicionar cada interesse selecionado ao utilizador
            foreach (var pref in dto.Preferencias) 
            {
                novoUsuario.Preferencias.Add(pref);
            }

            // Adiciona o novo utilizador ao DbSet correto e salva no Banco de Dados
            _context.Usuarios.Add(novoUsuario);
            await _context.SaveChangesAsync();
            return Created(string.Empty, new{});}
        

        // LOGIN 
        [HttpPost("login")]
        

        
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto dto)
        {
        // Procura o utilizador na base de dados pelo E-mail
        // Usamos Include(u => u.Sessoes) caso queiras manipular a lista de sessões diretamente
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        if (usuario == null)
            {
                return BadRequest(new { mensagem = "E-mail ou senha incorretos." });
            }

        // Senha compara a senha com o hash guardado, verifica o trabaho pra ver se as senhas batem
        bool senhaCorreta = BCrypt.Net.BCrypt.Verify(dto.Senha + pepper, usuario.SenhaHash);
        if (!senhaCorreta)
            {
                return BadRequest(new { message = "E-mail ou senha incorretos." }); 
            }

        var tokenHandler = new JwtSecurityTokenHandler();
            var chaveSecreta = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    // ADICIONANDO AS COORDENADAS DENTRO DO JWT
                    new Claim("latitude", dto.lat??"".ToString()),
                    new Claim("longitude", dto.lon??"".ToString()),
                    new Claim("nickname", usuario.Nickname)
                }),
                Expires = DateTime.UtcNow.AddDays(1), // O token expira em 1 dia
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(chaveSecreta), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var tokenObj = tokenHandler.CreateToken(tokenDescriptor);
            string jwtToken = tokenHandler.WriteToken(tokenObj);

            // EMITE O COOKIE HTTPONLY
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

        Response.Cookies.Append("JwtToken", jwtToken, cookieOptions);
        // Utiliza dados do usuario 
        usuario.UltimoLogin = DateTime.Now;
        _context.Usuarios.Update(usuario);
        // Salvar no Banco de Dados
        await _context.SaveChangesAsync();
        return Ok();
    }
} 
    //Controller para pegar dados de perfis
    [ApiController]
    [Route("api/usuario")]
    public class PerfilController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerfilController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetUsuario(string name)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Nickname == name);
            if (usuario == null)
            {
                return NotFound();
            }
            var result = new
            {
                nickname = usuario.Nickname,
                fotoPerfilUrl = usuario.FotoPerfilUrl,
                preferencias = usuario.Preferencias,
                descricao = usuario.Descricao,
                aniversario = usuario.Aniversario,
                vistoPorUltimo = usuario.UltimoLogin,
            };
            return Ok(result);
        }

}}