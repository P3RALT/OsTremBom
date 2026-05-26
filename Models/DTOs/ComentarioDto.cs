using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models.DTOs
{
    public class ComentarioDto
    {
        [Required(ErrorMessage = "O conteúdo do comentário é obrigatório sô!")]
        [MaxLength(100, ErrorMessage = "O comentário não pode passar de 100 caracteres.")]
        public required string Texto { get; set; }
    }
}