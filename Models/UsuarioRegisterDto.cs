using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models
{
    public class UsuarioRegisterDto
    {
        [Required]
        public string Nickname { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]        
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;

        [Required]
        public DateTime Aniversario { get; set; }

        public double? lat { get; set; }
        public double? lon { get; set; }
        public required string Genero { get; set; }
        public string? FotoPerfilUrl { get; set; }
        public string? ip { get; set; }
        
        // LISTA DE INTERESSES/PREFERENCIA
        public List<string> Preferencias { get; set; } = new List<string>();
    }
}