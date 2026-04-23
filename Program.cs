using Microsoft.EntityFrameworkCore;
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

// 2. Config do Banco de dados SQLite
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=TremBom.db"));

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// --- CONFIGURAÇÃO DO PIPELINE (A ordem importa!) ---
// Primeiro o CORS para liberar os pedidos
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    // Se estiver usando Swagger/OpenAPI
}

app.UseStaticFiles(); // Para servir seu HTML, CSS, JS da wwwroot
app.UseRouting();
app.UseAuthorization(); 
app.MapControllers();
// Faz o fallback para o index caso a rota não exista na API
app.MapFallbackToFile("index.html");

app.Run();