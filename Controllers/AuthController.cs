using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TremBomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        /// <summary>
        /// Obtém os dados do usuário atualmente autenticado com base no Token JWT.
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            // Recupera o ID do usuário (NameIdentifier) guardado nas Claims do Token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Recupera o Nickname guardado nas Claims do Token
            var nickname = User.FindFirst("nickname")?.Value;

            // Se por algum motivo o ID não estiver no token, retorna não autorizado
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { mensagem = "Usuário não identificado no token." });
            }

            // Retorna os dados essenciais do usuário logado
            return Ok(new
            {
                id = userId,
                nickname = nickname
            });
        }
    }
}