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