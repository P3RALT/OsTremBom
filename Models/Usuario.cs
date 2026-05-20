using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TremBomApi.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nickname é obrigatório")]
        [MinLength(3, ErrorMessage = "O nickname deve ter pelo menos 3 caracteres")]
        [MaxLength(50, ErrorMessage = "O nickname deve ter no máximo 50 caracteres")]
        [Column("nickname")]
        public string Nickname { get; set; } = string.Empty;

        [Required(ErrorMessage = "O email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [MaxLength(255)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("senha_hash")]
        public string SenhaHash { get; set; } = string.Empty;

        [Required]
        [Column("aniversario")]
        public DateTime Aniversario { get; set; }

        [Column("genero")]
        public required string Genero { get; set; }

        [Column("foto_perfil_url")]
        public string? FotoPerfilUrl { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        [Column("descricao")]
        public string? Descricao { get; set; }

        [Column("ip")]
        public string? IpRegistro { get; set; }

        [Column("ultimo_login")]
        public DateTime? UltimoLogin { get; set; }

        [Column("preferencias")]
        public List<string> Preferencias { get; set; } = new List<string>();

    }
}