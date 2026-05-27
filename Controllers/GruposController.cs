using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TremBomApi.Data;
using TremBomApi.Models;
using TremBomApi.Models.DTOs;
using Microsoft.AspNetCore.Authorization; // Importante para o Authorize funcionar
using System.Security.Claims; // Importante para ler o ID do usuário

namespace TremBomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GruposController(AppDbContext context)
        {
            _context = context;
        }

        // Método auxiliar educativo para extrair o ID do usuário do Token sem poluir o código
        private int ObterIdUsuarioLogado()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) throw new UnauthorizedAccessException("Usuário não autenticado.");
            return int.Parse(userIdStr);
        }

        [HttpGet]
        public async Task<IActionResult> ListarGrupos()
        {
            var grupos = await _context.Grupos
                .Include(g => g.Local)
                .Include(g => g.Membros)
                .OrderByDescending(g => g.Id)
                .ToListAsync();

            return Ok(grupos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterGrupoPorId(int id)
        {
            var grupo = await _context.Grupos.Include(g => g.Local).FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound();
            return Ok(grupo);
        }

        // =======================================================
        // CRIAR GRUPO
        // =======================================================
        [HttpPost]
        [Authorize] // Exige que o usuário esteja logado
        public async Task<IActionResult> CriarGrupo([FromBody] GrupoDto dto)
        {
            try
            {
                // Agora pegamos o ID real de quem está no sistema
                int idUsuarioLogado = ObterIdUsuarioLogado(); 

                var novoGrupo = new Grupo
                {
                    Nome = dto.Nome,
                    Descricao = dto.Descricao,
                    LimiteMembros = dto.LimiteMembros,
                    Privacidade = dto.Privacidade,
                    Senha = dto.Privacidade?.ToLower() == "privado" ? dto.Senha : null, 
                    LocalId = dto.LocalId,
                    ImagemUrl = dto.ImagemUrl, 
                    CriadorId = idUsuarioLogado // O usuário real é cravado como o dono!
                };

                _context.Grupos.Add(novoGrupo);
                await _context.SaveChangesAsync(); 

                // Vincula o criador ao grupo
                var membroCriador = new GrupoMembro
                {
                    GrupoId = novoGrupo.Id, 
                    UsuarioId = idUsuarioLogado
                };
                _context.GrupoMembros.Add(membroCriador);

                if (dto.MembrosIds != null && dto.MembrosIds.Count > 0)
                {
                    foreach (var usuarioId in dto.MembrosIds)
                    {
                        if (usuarioId == idUsuarioLogado) continue;
                        _context.GrupoMembros.Add(new GrupoMembro { GrupoId = novoGrupo.Id, UsuarioId = usuarioId });
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { id = novoGrupo.Id, mensagem = "Criado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro do Servidor: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // =======================================================
        // EDITAR GRUPO (APENAS O DONO PODE EDITAR)
        // =======================================================
        [HttpPut("{id}")]
        [Authorize] // Bloqueia acessos sem cookie de login
        public async Task<IActionResult> EditarGrupo(int id, [FromBody] GrupoDto dto)
        {
            var grupo = await _context.Grupos.FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não encontrado para edição.");

            int idUsuarioLogado;
            try {
                idUsuarioLogado = ObterIdUsuarioLogado();
            } catch {
                return Unauthorized();
            }

            // A MÁGICA DE SEGURANÇA: Só passa dessa linha se o cara for realmente o dono.
            if (grupo.CriadorId != idUsuarioLogado) 
                return StatusCode(403, new { mensagem = "Apenas o criador do grupo pode alterar as configurações." }); // 403 = Forbid

            try
            {
                grupo.Nome = dto.Nome;
                grupo.Descricao = dto.Descricao;
                grupo.LimiteMembros = dto.LimiteMembros;
                grupo.Privacidade = dto.Privacidade;
                grupo.LocalId = dto.LocalId;
                
                if (dto.Privacidade?.ToLower() == "privado") grupo.Senha = dto.Senha;
                else grupo.Senha = null;

                if (!string.IsNullOrWhiteSpace(dto.ImagemUrl))
                {
                    grupo.ImagemUrl = dto.ImagemUrl;
                }

                _context.Grupos.Update(grupo);
                await _context.SaveChangesAsync();

                return Ok(new { mensagem = "Configurações salvas!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro do Servidor: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // =======================================================
        // ENTRAR NO GRUPO
        // =======================================================
        [HttpPost("{id}/entrar")]
        [Authorize] // Qualquer usuário logado pode tentar entrar
        public async Task<IActionResult> EntrarNoGrupo(int id, [FromBody] EntradaGrupoDto pedido)
        {
            var grupo = await _context.Grupos.Include(g => g.Membros).FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não encontrado.");

            if (grupo.Privacidade?.ToLower() == "privado")
            {
                if (string.IsNullOrWhiteSpace(pedido.Senha) || grupo.Senha != pedido.Senha)
                    return BadRequest("Senha de acesso incorreta.");
            }

            int idUsuarioLogado;
            try {
                idUsuarioLogado = ObterIdUsuarioLogado();
            } catch {
                return Unauthorized();
            }

            if (grupo.Membros.Any(m => m.UsuarioId == idUsuarioLogado)) return Ok("Já é membro.");
            if (grupo.Membros.Count >= grupo.LimiteMembros) return BadRequest("Limite de vagas atingido.");

            _context.GrupoMembros.Add(new GrupoMembro { GrupoId = grupo.Id, UsuarioId = idUsuarioLogado });
            await _context.SaveChangesAsync();
            return Ok("Inscrito com sucesso!");
        }

        // =======================================================
        // EXCLUIR GRUPO (APENAS O DONO)
        // =======================================================
        [HttpDelete("{id}")]
        [Authorize] 
        public async Task<IActionResult> ExcluirGrupo(int id)
        {
            var grupo = await _context.Grupos.FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não localizado para exclusão.");

            int idUsuarioLogado;
            try {
                idUsuarioLogado = ObterIdUsuarioLogado();
            } catch {
                return Unauthorized();
            }

            // A MÁGICA DE SEGURANÇA NOVAMENTE
            if (grupo.CriadorId != idUsuarioLogado)
                return StatusCode(403, new { mensagem = "Acesso negado. Apenas o criador pode apagar este grupo." });

            try
            {
                _context.Grupos.Remove(grupo);
                await _context.SaveChangesAsync();
                return Ok(new { mensagem = "Grupo excluído permanentemente com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro do Servidor ao tentar excluir: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
    }

    public class EntradaGrupoDto { public string? Senha { get; set; } }
}