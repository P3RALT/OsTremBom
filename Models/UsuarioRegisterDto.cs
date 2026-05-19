using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models
{
    public class UsuarioRegisterDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        public string Sobrenome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]        
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;
        public string? FotoPerfilUrl { get; set; }
        
        // LISTA DE INTERESSES/PREFERENCIA
        public List<string> Preferencias { get; set; } = new List<string>();
    }
}