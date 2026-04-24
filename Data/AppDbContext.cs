using Microsoft.EntityFrameworkCore;
using TremBomApi.Models;
using System;

namespace TremBomApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Local> Locais { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Local>().HasData(
                new Local 
                { 
                    Id = 101, 
                    Nome = "Mercado Central", 
                    Categoria = "Edifício Gastronômico",
                    Endereco = "Av. Augusto de Lima, 744 - Centro, Belo Horizonte",
                    OqFazer = "Comprar queijos, doces, artesanatos e provar o famoso fígado com jiló.",
                    Dicas = "Vá cedo nos finais de semana para evitar multidões e não deixe de visitar a loja de queijos do Mário.",
                    PqVisitar = "É considerado um dos melhores mercados do mundo e a alma da cultura mineira.",
                    ImagemUrl = "https://viajenaweb.com/wp-content/uploads/2016/12/O-que-fazer-no-Mercado-Central-de-Belo-Horizonte-768x432.jpg.webp",
                    Descricao = "O clássico: fígado com jiló, queijos premiados e o melhor doce de leite.",
                    AvaliacaoNota = 4.8,
                    HorarioTexto = "Segunda a Sábado: 07:00 - 18:00",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                },
                new Local 
                { 
                    Id = 102, 
                    Nome = "Mercado Novo", 
                    Categoria = "Edifício Gastronômico",
                    Endereco = "Rua Rio de Janeiro, 600 - Centro, Belo Horizonte",
                    OqFazer = "Visitar bares de cerveja artesanal, destilarias e comer comida de raiz.",
                    Dicas = "O segundo andar é onde a 'magia' acontece. Experimente o Gin da Lamparina.",
                    PqVisitar = "Um espaço que une o retrô industrial com o que há de mais moderno na gastronomia de BH.",
                    ImagemUrl = "https://www.hojeemdia.com.br/image/policy:1.992457.1702919772:1702919772/image.jpg?f=2x1&w=1200",
                    ImagemUrl2 = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/3f/e2/0d/mercado-novo.jpg", 
                    ImagemUrl3 = "https://bhaz.com.br/wp-content/uploads/2019/07/mercado-novo-bh-1.jpg",
                    Descricao = "Cozinha de raiz, bares artesanais e um ambiente retrô industrial incrível.",
                    AvaliacaoNota = 3.8,
                    HorarioTexto = "Quinta-feira: 08:00 - 18:00",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                },
                new Local 
                { 
                    Id = 103, 
                    Nome = "Edifício Maletta", 
                    Categoria = "Edifício Gastronômico",
                    Endereco = "Rua da Bahia, 1148 - Centro, Belo Horizonte",
                    OqFazer = "Tomar um café, visitar sebos e curtir a noite nas varandas do segundo andar.",
                    Dicas = "A Cantina do Lucas é patrimônio histórico e fica no térreo.",
                    PqVisitar = "Ponto de encontro boêmio histórico de intelectuais e artistas de Minas.",
                    ImagemUrl = "https://resize.casapino.com.br/?u=https://cms-bomgourmet.s3.amazonaws.com/bomgourmet/2018/10/201810/maletta-belo-horizonte-varanda-20f288a0.jpg&w=661",
                    Descricao = "Varandas icônicas e bares históricos no centro de BH.",
                    AvaliacaoNota = 4.5,
                    HorarioTexto = "Terça a Domingo: 11:00 - 00:00",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                },
                new Local 
                { 
                    Id = 104, 
                    Nome = "Bar do Orlando", 
                    Categoria = "Bar",
                    Endereco = "Rua Almeida Castro, 161 - Santa Tereza, Belo Horizonte",
                    OqFazer = "Tomar cerveja gelada no copo americano e comer o petisco de linguiça.",
                    Dicas = "Chegue antes do pôr do sol para garantir uma mesa na calçada.",
                    PqVisitar = "Fundado em 1919, é o bar mais antigo em funcionamento contínuo de BH.",
                    ImagemUrl = "https://folhadesetelagoas.com.br/images/noticias/190/9f40c1539471322fcf360b2a9be33a36.jpeg",
                    Descricao = "O bar mais antigo de BH, patrimônio do bairro Santa Tereza.",
                    AvaliacaoNota = 4.9,
                    HorarioTexto = "Todos os dias: 09:00 - 22:00",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                },
                new Local 
                { 
                    Id = 105, 
                    Nome = "Juramento 202", 
                    Categoria = "Bar",
                    Endereco = "Rua Juramento, 202 - Pompeia, Belo Horizonte",
                    OqFazer = "Degustar chopes artesanais da Viela e ouvir música brasileira.",
                    Dicas = "O local é pequeno e a galera fica na rua, o clima é super descontraído.",
                    PqVisitar = "Representa o renascimento dos bares de bairro com foco em qualidade artesanal.",
                    ImagemUrl = "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/04/71/ad/img-20181005-wa0018-largejpg.jpg?w=1000&h=-1&s=1",
                    Descricao = "Cervejaria local com clima de calçada e muita mineiridade.",
                    AvaliacaoNota = 4.7,
                    HorarioTexto = "Quarta a Domingo: 17:00 - 23:00",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                },
                new Local 
                { 
                    Id = 106, 
                    Nome = "Forno da Saudade", 
                    Categoria = "Pizzaria",
                    Endereco = "Rua Patrocínio, 1 - Carlos Prates, Belo Horizonte",
                    OqFazer = "Comer pizzas individuais de longa fermentação com vista para a cidade.",
                    Dicas = "Tente pegar um lugar na varanda para ver as luzes de BH à noite.",
                    PqVisitar = "A localização em um casarão antigo no alto de uma colina proporciona uma experiência única.",
                    ImagemUrl = "https://andadireito.com.br/wp-content/uploads/2025/12/Forno-da-Saudade-5.png",
                    Descricao = "Pizzaria charmosa em um casarão dos anos 30 com vista panorâmica.",
                    AvaliacaoNota = 4.6,
                    HorarioTexto = "Terça a Domingo: 18:00 - 23:30",
                    DataCadastro = new DateTime(2026, 4, 22),
                    Ativo = true
                }
            );
        }
    }
}