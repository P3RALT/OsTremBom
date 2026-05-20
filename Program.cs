using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TremBomApi.Data;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURAÇÃO DE SERVIÇOS ---
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 1. CONFIGURAÇÃO DO CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()   
              .AllowAnyMethod() 
              .AllowAnyHeader();  
    });
});
// Configuração da autenticação JWT
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ??"")
            )
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["JwtToken"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// 2. Config do Banco de dados SQLite
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=TremBom.db"));

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// --- CONFIGURAÇÃO DO PIPELINE (A ordem importa!) ---
// Primeiro o CORS para liberar os pedidos
app.UseCors("AllowFrontend");


app.UseStaticFiles(); // Para servir seu HTML, CSS, JS da wwwroot
app.UseRouting();
app.UseAuthorization(); 
app.MapControllers();
// Faz o fallback para o feed caso a rota não exista na API
app.MapFallbackToFile("/page/feed.html");

app.Run();