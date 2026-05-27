using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TremBomApi.Data;
using TremBomApi.Models;
using TremBomApi.Models.DTOs;

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
        // CRIAR GRUPO (AGORA SALVA IMAGEM CORRETAMENTE)
        // =======================================================
        [HttpPost]
        public async Task<IActionResult> CriarGrupo([FromBody] GrupoDto dto)
        {
            try
            {
                int idUsuarioLogado = 1; // Simula usuário logado

                var novoGrupo = new Grupo
                {
                    Nome = dto.Nome,
                    Descricao = dto.Descricao,
                    LimiteMembros = dto.LimiteMembros,
                    Privacidade = dto.Privacidade,
                    Senha = dto.Privacidade?.ToLower() == "privado" ? dto.Senha : null, 
                    LocalId = dto.LocalId,
                    ImagemUrl = dto.ImagemUrl, // GRAVA A IMAGEM!
                    CriadorId = idUsuarioLogado // GRAVA O DONO!
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
                
                // RETORNA UM OBJETO ANÔNIMO (Isso evita o Erro Crítico 500 de Loop de JSON)
                return Ok(new { id = novoGrupo.Id, mensagem = "Criado com sucesso!" });
            }
            catch (Exception ex)
            {
                // Devolve a mensagem real de erro para o Front-end
                return StatusCode(500, $"Erro do Servidor: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // =======================================================
        // EDITAR GRUPO (PERMITE MUDAR TÍTULO, CAPA, VAGAS, ETC)
        // =======================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarGrupo(int id, [FromBody] GrupoDto dto)
        {
            var grupo = await _context.Grupos.FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não encontrado para edição.");

            // Verifica se é o dono editando
            int idUsuarioLogado = 1; 
            if (grupo.CriadorId != idUsuarioLogado && grupo.CriadorId != 0) 
                return Forbid("Apenas o criador do grupo pode alterar as configurações.");

            try
            {
                grupo.Nome = dto.Nome;
                grupo.Descricao = dto.Descricao;
                grupo.LimiteMembros = dto.LimiteMembros;
                grupo.Privacidade = dto.Privacidade;
                grupo.LocalId = dto.LocalId;
                
                if (dto.Privacidade?.ToLower() == "privado") grupo.Senha = dto.Senha;
                else grupo.Senha = null;

                // Só substitui a imagem se o usuário escolheu uma nova
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

        [HttpPost("{id}/entrar")]
        public async Task<IActionResult> EntrarNoGrupo(int id, [FromBody] EntradaGrupoDto pedido)
        {
            var grupo = await _context.Grupos.Include(g => g.Membros).FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não encontrado.");

            if (grupo.Privacidade?.ToLower() == "privado")
            {
                if (string.IsNullOrWhiteSpace(pedido.Senha) || grupo.Senha != pedido.Senha)
                    return BadRequest("Senha de acesso incorreta.");
            }

            int idUsuarioLogado = 1; 
            if (grupo.Membros.Any(m => m.UsuarioId == idUsuarioLogado)) return Ok("Já é membro.");
            if (grupo.Membros.Count >= grupo.LimiteMembros) return BadRequest("Limite de vagas atingido.");

            _context.GrupoMembros.Add(new GrupoMembro { GrupoId = grupo.Id, UsuarioId = idUsuarioLogado });
            await _context.SaveChangesAsync();
            return Ok("Inscrito com sucesso!");
        }

        // =======================================================
        // EXCLUIR GRUPO (APENAS O CRIADOR PODE REMOVER)
        // =======================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirGrupo(int id)
        {
            var grupo = await _context.Grupos.FirstOrDefaultAsync(g => g.Id == id);
            if (grupo == null) return NotFound("Grupo não localizado para exclusão.");

            // Validação de segurança no Servidor
            int idUsuarioLogado = 1;
            if (grupo.CriadorId != idUsuarioLogado && grupo.CriadorId != 0)
                return Forbid("Acesso negado. Apenas o criador pode apagar este grupo.");

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