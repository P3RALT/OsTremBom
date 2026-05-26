using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TremBomApi.Data; // Ajuste para o namespace correto do seu AppDbContext
using TremBomApi.Models;

namespace TremBomApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O construtor injeta o contexto do banco de dados automaticamente
        public GruposController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Grupos
        [HttpPost]
        public async Task<IActionResult> CriarGrupo([FromBody] GrupoDto dto)
        {
            // Validação básica se os dados enviados respeitam as regras do DTO
            if (dto == null)
            {
                return BadRequest("Os dados do grupo não foram enviados corretamente.");
            }

            if (string.IsNullOrWhiteSpace(dto.Nome))
            {
                return BadRequest("O nome do grupo é obrigatório.");
            }

            try
            {
                // 1. Mapeia o DTO para a Entidade principal do Banco de Dados
                var novoGrupo = new Grupo
                {
                    Nome = dto.Nome,
                    Descricao = dto.Descricao,
                    LimiteMembros = dto.LimiteMembros,
                    Privacidade = dto.Privacidade,
                    Senha = dto.Privacidade == "privado" ? dto.Senha : null, // Só salva senha se for privado
                    LocalId = dto.LocalId
                };

                // 2. Adiciona o grupo ao contexto e salva para gerar o ID do grupo
                _context.Grupos.Add(novoGrupo);
                await _context.SaveChangesAsync(); 

                // 3. Vincula os membros selecionados na tabela associativa (se houver algum)
                if (dto.MembrosIds != null && dto.MembrosIds.Count > 0)
                {
                    // REGRA DE SEGURANÇA: Valida se a quantidade de convidados não estoura o limite do grupo
                    // (+1 representa o dono do grupo que está criando)
                    if (dto.MembrosIds.Count + 1 > dto.LimiteMembros)
                    {
                        return BadRequest($"A quantidade de membros convidados excede o limite máximo de {dto.LimiteMembros} pessoas configurado para este grupo.");
                    }

                    foreach (var usuarioId in dto.MembrosIds)
                    {
                        var vinculoMembro = new GrupoMembro
                        {
                            GrupoId = novoGrupo.Id, // ID gerado automaticamente no passo anterior
                            UsuarioId = usuarioId
                        };
                        
                        _context.GrupoMembros.Add(vinculoMembro);
                    }

                    // Salva as associações de membros no banco
                    await _context.SaveChangesAsync();
                }

                // Retorna o status 201 (Created) e o objeto criado
                return CreatedAtAction(nameof(CriarGrupo), new { id = novoGrupo.Id }, novoGrupo);
            }
            catch (Exception ex)
            {
                // Tratamento de erro didático para te ajudar no console caso algo falhe
                return StatusCode(500, $"Erro interno ao salvar o grupo: {ex.Message}");
            }
        }
    }
}