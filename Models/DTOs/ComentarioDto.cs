using System.ComponentModel.DataAnnotations;

namespace TremBomApi.Models.DTOs
{
    public class ComentarioDto
    {
        [MaxLength(100, ErrorMessage = "O comentário não pode passar de 100 caracteres.")]
        public required string Texto { get; set; }
    }
}