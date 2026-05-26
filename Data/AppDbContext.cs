using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using System;

namespace TremBomApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        // ==========================================================================
        // 1. REGISTRO DOS DATASETS (TABELAS DO BANCO DE DADOS)
        // ==========================================================================
        public DbSet<Local> Locais { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Likes> Likes { get; set; }
        public DbSet<Comentarios> Comentarios { get; set; }
        public DbSet<Publicacao> Publicacoes { get; set; }
        public DbSet<PublicacaoFoto> PublicacoesFotos { get; set; }
        public DbSet<Seguidores> Seguidores { get; set; }
        public DbSet<Grupo> Grupos { get; set; }
        public DbSet<GrupoMembro> GrupoMembros { get; set; }

        // ==========================================================================
        // 2. CONFIGURAÇÃO DAS REGRAS E RELACIONAMENTOS DO MODELO (ON MODEL CREATING)
        // ==========================================================================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Garante que o Nickname de cada utilizador seja único no sistema
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Nickname)
                .IsUnique(); 

            // SOLUÇÃO DO ERRO CRÍTICO: Define a chave composta necessária para a tabela intermediária
            modelBuilder.Entity<GrupoMembro>()
                .HasKey(gm => new { gm.GrupoId, gm.UsuarioId });
        }
    }
}