using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using System;

namespace TremBomApi.Data
{
    /*
     * PROPÓSITO DA CLASSE:
     * O AppDbContext é a ponte principal entre a aplicação em C# e o Banco de Dados. 
     * Ele gerencia as conexões, mapeia as tabelas através dos DbSets e dita as regras
     * de integridade referencial (como chaves estrangeiras e exclusões em cascata).
     */
    public class AppDbContext : DbContext
    {
        // O construtor recebe as opções de configuração (como a String de Conexão) injetadas pelo Program.cs
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        // ==========================================================================
        // 1. REGISTRO DOS DATASETS (TABELAS DO BANCO DE DADOS)
        // ==========================================================================
        
        // Mapeia a tabela 'locais' (Armazena coordenadas, dados do Groq e estabelecimentos)
        public DbSet<Local> Locais { get; set; }
        
        // Mapeia a tabela 'usuarios' (Contas, preferências e hashes de senhas)
        public DbSet<Usuario> Usuarios { get; set; }
        
        // Mapeia a tabela 'likes' (Interações de curtidas essenciais para o feed e trending)
        public DbSet<Likes> Likes { get; set; }
        
        // Mapeia a tabela 'comentarios' (Textos vinculados aos posts dos usuários)
        public DbSet<Comentarios> Comentarios { get; set; }
        
        // Mapeia a tabela 'publicacoes' (O coração do feed, contendo a descrição e vínculos principais)
        public DbSet<Publicacao> Publicacoes { get; set; }
        
        // Mapeia a tabela 'publicacoes_fotos' (Armazena os caminhos físicos /wwwroot das mídias dos posts)
        public DbSet<PublicacaoFoto> PublicacoesFotos { get; set; }
        
        // Mapeia a tabela 'seguidores' (Sistema de conexões muitos para muitos entre contas de usuários)
        public DbSet<Seguidores> Seguidores { get; set; }
        
        // Mapeia a tabela 'Grupos' (Comunidades criadas para marcar encontros nos locais)
        public DbSet<Grupo> Grupos { get; set; }
        
        // Mapeia a tabela intermediária 'GrupoMembros' (Controle N:N de usuários inseridos em grupos)
        public DbSet<GrupoMembro> GrupoMembros { get; set; }

        // ==========================================================================
        // 2. CONFIGURAÇÃO DAS REGRAS E RELACIONAMENTOS DO MODELO (ON MODEL CREATING)
        // ==========================================================================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Executa as configurações padrões da classe base do DbContext
            base.OnModelCreating(modelBuilder);

            // Garante que o Nickname de cada utilizador seja único no sistema a nível de banco de dados
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Nickname)
                .IsUnique(); 

            // Configura a tabela intermediária de membros do grupo
            modelBuilder.Entity<GrupoMembro>()
                .HasKey(gm => new { gm.GrupoId, gm.UsuarioId }); // Define a Chave Primária Composta

            // ==========================================================================
            // 3. OTIMIZAÇÃO E PREVENÇÃO DE CONFLITOS DE DELEÇÃO (MUITO IMPORTANTE)
            // ==========================================================================

            // Regra para SEGUIDORES: Mapeia as duas pontas da tabela de followers de forma segura
            modelBuilder.Entity<Seguidores>()
                .HasOne(s => s.SeguidorUsuario)
                .WithMany()
                .HasForeignKey(s => s.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict); // Impede deleção cíclica no banco

            modelBuilder.Entity<Seguidores>()
                .HasOne(s => s.AlvoUsuario)
                .WithMany()
                .HasForeignKey(s => s.AlvoUsuarioId)
                .OnDelete(DeleteBehavior.Restrict); // Impede deleção cíclica no banco

            // Regra para LIKES: Evita travamento caso o usuário ou a publicação sejam removidos
            modelBuilder.Entity<Likes>()
                .HasOne(l => l.Usuario)
                .WithMany()
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Likes>()
                .HasOne(l => l.Publicacao)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PublicacaoId)
                .OnDelete(DeleteBehavior.Cascade); // Se o post cair, os likes caem juntos

            // Regra para COMENTÁRIOS: Garante consistência de dados textuais
            modelBuilder.Entity<Comentarios>()
                .HasOne(c => c.Usuario)
                .WithMany()
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Comentarios>()
                .HasOne(c => c.Publicacao)
                .WithMany(p => p.Comentarios)
                .HasForeignKey(c => c.PublicacaoId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}