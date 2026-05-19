using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using System;

namespace TremBomApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Local> Locais { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    } }