using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DA DTO:
     * Objeto de transferência para o registro manual ou via formulário de novos locais turísticos,
     * bares ou restaurantes parceiros na plataforma "TremBom".
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - LocaisController.cs -> Desenhado para rotas futuras de criação/gerenciamento de estabelecimentos.
     */

    public class LocalRegisterDto
    {
        [Required(ErrorMessage = "O nome do estabelecimento é obrigatório.")]
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

        [Required(ErrorMessage = "A coordenada de latitude é obrigatória.")]
        public double Latitude { get; set; }

        [Required(ErrorMessage = "A coordenada de longitude é obrigatória.")]
        public double Longitude { get; set; }

        public string? OqFazer { get; set; }

        public string? Dicas { get; set; }

        public string? PqVisitar { get; set; }
        
        public string? HorarioTexto { get; set; }
    }
}