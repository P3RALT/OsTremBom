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

        /// <summary>
        /// Cria um novo grupo e vincula os membros iniciais enviados.
        /// </summary>
    
        [HttpPost]
        public async Task<IActionResult> CriarGrupo([FromBody] GrupoDto dto)
        {
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
                // 1. Mapeia o DTO para a Entidade do Banco de Dados
                var novoGrupo = new Grupo
                {
                    Nome = dto.Nome,
                    Descricao = dto.Descricao,
                    LimiteMembros = dto.LimiteMembros,
                    Privacidade = dto.Privacidade,
                    // Garante que se não for "privado", a senha nunca será salva
                    Senha = dto.Privacidade?.ToLower() == "privado" ? dto.Senha : null, 
                    LocalId = dto.LocalId
                };

                // 2. Adiciona e salva para gerar o ID do grupo
                _context.Grupos.Add(novoGrupo);
                await _context.SaveChangesAsync(); 

                // 3. Vincula os membros (se houver algum na lista)
                if (dto.MembrosIds != null && dto.MembrosIds.Count > 0)
                {
                    // Validação do limite configurado para o grupo (+1 é o criador)
                    if (dto.MembrosIds.Count + 1 > dto.LimiteMembros)
                    {
                        return BadRequest($"A quantidade de membros convidados excede o limite máximo de {dto.LimiteMembros} pessoas.");
                    }

                    foreach (var usuarioId in dto.MembrosIds)
                    {
                        var vinculoMembro = new GrupoMembro
                        {
                            GrupoId = novoGrupo.Id, 
                            UsuarioId = usuarioId
                        };
                        
                        _context.GrupoMembros.Add(vinculoMembro);
                    }

                    // Salva todos os vínculos criados no laço de repetição
                    await _context.SaveChangesAsync();
                }

                // Retorna 201 Created com a rota para buscar o grupo futuramente
                return CreatedAtAction(nameof(CriarGrupo), new { id = novoGrupo.Id }, novoGrupo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno ao salvar o grupo: {ex.Message}");
            }
        }
    }
}