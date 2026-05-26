using System.Collections.Generic;

namespace TremBomApi.Models.DTOs
{
    /*
     * PROPÓSITO DAS DTOs DESTA CLASSE:
     * Estruturas de mapeamento para desserialização do JSON da API do Groq (Inteligência Artificial).
     * O 'ResumoLocalIA' serve para capturar a resposta estruturada dos prompts de turismo.
     * O 'GroqResponse' e seus filhos espelham exatamente a árvore de resposta padrão enviada pela API do Llama.
     * * CONTROLLERS / FUNÇÕES ATRIBUÍDAS:
     * - LocaisController.cs -> Utilizado na função 'BuscarPorId(int id)' dentro da subfunção 'ChamarIA(string prompt)'.
     */

    public class ResumoLocalIA
    {
        public string Resumo { get; set; } = string.Empty;
        public string OqFazer { get; set; } = string.Empty;
        public string Dicas { get; set; } = string.Empty;
        public string PqVisitar { get; set; } = string.Empty;
    }

    public class GroqResponse
    {
        public List<GroqChoice> Choices { get; set; } = new();
    }

    public class GroqChoice
    {
        public GroqMessage Message { get; set; } = new();
    }

    public class GroqMessage
    {
        public string Content { get; set; } = string.Empty;
    } 
}