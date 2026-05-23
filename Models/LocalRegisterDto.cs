using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models
{
    public class LocalRegisterDto
    {
        [Required]
        [MaxLength(255)]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Categoria { get; set; }

        public string? Descricao { get; set; }

        [MaxLength(500)]
        public string? Rua { get; set; }

        public int? Numero { get; set; }

        public string? Bairro { get; set; }

        public int? CEP { get; set; }

        public string? Cidade { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public string? OqFazer { get; set; }

        public string? Dicas { get; set; }

        public string? PqVisitar { get; set; }
        public string? HorarioTexto { get; set; }
    }
}