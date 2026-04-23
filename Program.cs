using Microsoft.EntityFrameworkCore;
using TremBomApi.Data;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURAÇÃO DE SERVIÇOS ---

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 1. CONFIGURAÇÃO DO CORS (O que faltava!)
// Isso permite que o seu HTML acesse a API sem ser bloqueado pelo navegador
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

app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization(); 

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();