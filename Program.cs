using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TremBomApi.Data;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================================
// 1. CONFIGURAÇÃO DE SERVIÇOS (CONTAINER DE INJEÇÃO DE DEPENDÊNCIA)
// ==========================================================================

// Adiciona o serviço necessário para mapear os endpoints das Controllers da API
builder.Services.AddControllers();

// Adiciona ferramentas de suporte e documentação da API (OpenAPI/Swagger)
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

// CORREÇÃO CRÍTICA DO CORS: 
// Como a API utiliza Cookies HttpOnly para o JWT, o uso de 'AllowAnyOrigin()' bloqueia a leitura do cookie.
// Configuramos para permitir credenciais vindas das portas padrões de desenvolvimento local.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000") // Origens comuns do Front (Live Server/React)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // OBRIGATÓRIO para tráfego de cookies HttpOnly entre Front e Back
    });
});

// Configuração do ecossistema de autenticação via tokens criptografados (JWT)
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,        // Altere para true em produção se assinar de um servidor fixo
            ValidateAudience = false,      // Altere para true em produção para restringir o cliente alvo
            ValidateLifetime = true,       // Valida se o token não passou do prazo de validade de 1 dia
            ValidateIssuerSigningKey = true, // Exige que a assinatura do token bata com a nossa chave privada
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "ChaveSuperSecretaPadraoDeSeguranca123!")
            )
        };

        // EVENTO CUSTOMIZADO: Intercepta a requisição HTTP e extrai o JWT de dentro do Cookie seguro
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Busca o valor gravado na chave "JwtToken" dentro dos cookies da requisição
                context.Token = context.Request.Cookies["JwtToken"];
                return Task.CompletedTask;
            }
        };
    });

// Ativa as políticas do sistema de autorização (como o uso do [Authorize] e [AllowAnonymous])
builder.Services.AddAuthorization();

// CONFIGURAÇÃO DO BANCO DE DADOS: Configura o contexto do DbContext para usar o motor leve SQLite
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=TremBom.db"));


    builder.Services.AddControllers().AddJsonOptions(x =>
{
    // Isso impede que o C# tente listar o grupo dentro do membro infinitamente
    x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

// ==========================================================================
// 2. CONFIGURAÇÃO DO PIPELINE DE REQUISIÇÕES HTTP (A ORDEM AQUI É VITAL!)
// ==========================================================================

// PASSO 1: O CORS deve ser sempre o primeiro para não bloquear as requisições vindas do navegador
app.UseCors("AllowFrontend");

// PASSO 2: Ativa o servidor de arquivos estáticos (permite acessar fotos de /wwwroot/img/posts-imgs)
app.UseStaticFiles(); 

// PASSO 3: Habilita o mecanismo de roteamento da aplicação
app.UseRouting();

// CORREÇÃO CRÍTICA DE PIPELINE: Ativa o middleware de identificação. Sem ele, o [Authorize] quebra!
app.UseAuthentication(); 

// PASSO 5: Com o usuário devidamente autenticado (identificado), verifica se ele tem permissão de acesso
app.UseAuthorization(); 

// PASSO 6: Mapeia as rotas configuradas via reflexão dentro da pasta Controllers
app.MapControllers();

// PASSO 7: Caso o usuário digite uma URL inválida ou tente atualizar a página no navegador, 
// o servidor faz o Fallback redirecionando o fluxo visual de volta para a tela do Feed.
app.MapFallbackToFile("/page/feed.html");

// Inicializa o servidor Web do ASP.NET Core
app.Run();