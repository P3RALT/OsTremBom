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
        public DbSet<Likes> Likes { get; set; }
        public DbSet<Comentarios> Comentarios { get; set; }
        public DbSet<Publicacao> Publicacoes { get; set; }
        public DbSet<PublicacaoFoto> PublicacoesFotos { get; set; }
        public DbSet<Seguidores> Seguidores { get; set; }

        // Este método é chamado quando o modelo do banco de dados está sendo criado
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Fazendo o nickname ser único
            modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Nickname)
            .IsUnique(); 
            /* Não precisamos de data seeding mais, já q o sistema agr é responsivo e dinâmico
            modelBuilder.Entity<Local>().HasData(
                new Local
                {
                    Id = 1,
                    Nome = "Igreja São Francisco de Assis (Igrejinha da Pampulha)",
                    Categoria = "Cultura e Arquitetura",
                    Resumo = null,
                    Rua = "Avenida Otacílio Negrão de Lima",
                    Numero = 3000,
                    Bairro = "Pampulha",
                    CEP = 31365450,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.8585,
                    Longitude = -43.9791,
                    OqFazer = "Tirar fotos da fachada, visitar o interior do museu e caminhar pela orla.",
                    Dicas = "Vá no fim da tarde para pegar o pôr do sol na lagoa.",
                    PqVisitar = "É o principal cartão-postal de BH e Patrimônio Cultural da Humanidade pela UNESCO.",
                    ImagemUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg/250px-Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg",
                    AvaliacaoNota = 4.8,
                    TotalLikes = 150,
                    TotalComentarios = 45,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 2,
                    Nome = "Mercado Central de Belo Horizonte",
                    Categoria = "Gastronomia e Compras",
                    Resumo = null,
                    Rua = "Avenida Augusto de Lima",
                    Numero = 744,
                    Bairro = "Centro",
                    CEP = 30190056,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9229,
                    Longitude = -43.9444,
                    OqFazer = "Provar o famoso fígado com jiló, comprar queijo canastra e doces caseiros.",
                    Dicas = "Costuma ficar muito cheio aos sábados de manhã. Vá de táxi ou aplicativo pois o estacionamento é disputado.",
                    PqVisitar = "Eleito um dos melhores mercados do mundo, é o melhor lugar para sentir a verdadeira vibe mineira.",
                    ImagemUrl = "https://exemplo.com/mercado1.jpg",
                    AvaliacaoNota = 4.9,
                    TotalLikes = 320,
                    TotalComentarios = 98,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 3,
                    Nome = "Praça da Liberdade",
                    Categoria = "Lazer e Cultura",
                    Resumo = null,
                    Rua = "Praça da Liberdade",
                    Numero = 1,
                    Bairro = "Funcionários",
                    CEP = 30140010,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9323,
                    Longitude = -43.9381,
                    OqFazer = "Caminhar sob a alameda de palmeiras imperiais e visitar os museus ao redor.",
                    Dicas = "A visitação à maioria dos museus do circuito é gratuita.",
                    PqVisitar = "Une uma linda área verde com acesso direto aos melhores museus e centros culturais da cidade.",
                    ImagemUrl = "https://www.quintoandar.com.br/guias/wp-content/uploads/2023/04/Praca-da-Liberdade-em-Belo-Horizonte-Foto-Shutterstock.jpg",
                    AvaliacaoNota = 4.7,
                    TotalLikes = 210,
                    TotalComentarios = 35,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 4,
                    Nome = "Mirante do Mangabeiras",
                    Categoria = "Natureza e Vista",
                    Resumo = null,
                    Rua = "Rua Pedro José Pardo",
                    Numero = 100,
                    Bairro = "Mangabeiras",
                    CEP = 30210310,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9482,
                    Longitude = -43.9168,
                    OqFazer = "Apreciar a vista das plataformas de madeira e tirar fotos panorâmicas.",
                    Dicas = "Leve um agasalho, pois costuma ventilar bastante e fazer frio lá em cima.",
                    PqVisitar = "É o ponto mais alto e bonito para ver a imensidão de Belo Horizonte lá do alto.",
                    ImagemUrl = "https://offloadmedia.feverup.com/belohorizontesecreto.com/wp-content/uploads/2023/08/21122832/mirantes-em-belo-horizonte-1024x683.jpg",
                    AvaliacaoNota = 4.6,
                    TotalLikes = 185,
                    TotalComentarios = 29,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 5,
                    Nome = "Minerão (Estádio Governador Magalhães Pinto)",
                    Categoria = "Esportes e Eventos",
                    Resumo = null,
                    Rua = "Avenida Antônio Abrahão Caram",
                    Numero = 1001,
                    Bairro = "São José",
                    CEP = 31275000,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.8659,
                    Longitude = -43.9710,
                    OqFazer = "Visitar o Museu do Futebol Mineiro e andar de skate ou patins na esplanada.",
                    Dicas = "A esplanada do Mineirão é enorme e excelente para passar a tarde com crianças e pets.",
                    PqVisitar = "Item indispensável para quem ama futebol e quer conhecer o templo do esporte em Minas.",
                    ImagemUrl = "https://historiadofutebol.com/blog/wp-content/uploads/2013/11/092-001-500x330.jpg",
                    AvaliacaoNota = 4.7,
                    TotalLikes = 250,
                    TotalComentarios = 60,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 6,
                    Nome = "Parque Municipal Américo Renné Giannetti",
                    Categoria = "Natureza e Parque",
                    Resumo = "O mais antigo parque ambiental de BH, localizado bem no centro da cidade, um verdadeiro refúgio verde.",
                    Rua = "Avenida Afonso Pena",
                    Numero = 1377,
                    Bairro = "Centro",
                    CEP = 30130003,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9242,
                    Longitude = -43.9306,
                    OqFazer = "Andar de barco a remo nas lagoas, fazer piquenique e ver os pequenos monumentos.",
                    Dicas = "O parque abriga o tradicional Teatro Francisco Nunes, vale checar a programação.",
                    PqVisitar = "Ideal para desacelerar e curtir a natureza sem sair da região central da capital.",
                    ImagemUrl = "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/foto-pbh.jpg",
                    AvaliacaoNota = 4.5,
                    TotalLikes = 140,
                    TotalComentarios = 22,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 7,
                    Nome = "Praça do Papa",
                    Categoria = "Lazer e Vista",
                    Resumo = "Localizada nas altas do bairro Mangabeiras, ganhou esse nome após a visita do Papa João Paulo II em 1980.",
                    Rua = "Praça Israel Pinheiro",
                    Numero = 1,
                    Bairro = "Mangabeiras",
                    CEP = 30210130,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9453,
                    Longitude = -43.9142,
                    OqFazer = "Sentar no gramado, contemplar o horizonte e descansar.",
                    Dicas = "Perfeito para levar uma canga, lanche e fazer um piquenique no final de semana.",
                    PqVisitar = "Famosa pela frase do Papa: 'Que belo horizonte!'. A energia e a paz do lugar são incríveis.",
                    ImagemUrl = "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/praca-do-papa_qu4rto-studio-0056-1_0.jpg",
                    AvaliacaoNota = 4.8,
                    TotalLikes = 280,
                    TotalComentarios = 40,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 8,
                    Nome = "Inhotim (Instituto Contemporâneo)",
                    Categoria = "Arte e Botânica",
                    Resumo = "Embora fique em Brumadinho (região metropolitana), é a principal extensão turística cultural de quem visita BH. Maior museu a céu aberto do mundo.",
                    Rua = "Rua B",
                    Numero = 20,
                    Bairro = "Inhotim",
                    CEP = 35460000,
                    Cidade = "Brumadinho",
                    Latitude = -20.1241,
                    Longitude = -44.2201,
                    OqFazer = "Caminhar pelos jardins botânicos espetaculares e entrar nas galerias de arte contemporânea.",
                    Dicas = "Use sapatos muito confortáveis, o museu é gigante e você vai andar bastante.",
                    PqVisitar = "Referência internacional, une perfeitamente arte contemporânea de ponta com paisagismo exuberante.",
                    ImagemUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYgiX-foSy-CNzygiQBc9Z95TOzdbfFNAWA&s",
                    AvaliacaoNota = 4.9,
                    TotalLikes = 500,
                    TotalComentarios = 150,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 9,
                    Nome = "Sesc Palladium",
                    Categoria = "Cultura e Teatro",
                    Resumo = "Grande centro cultural no centro de BH que recebe shows, peças de teatro, cinema e exposições de arte.",
                    Rua = "Rua Rio de Janeiro",
                    Numero = 1046,
                    Bairro = "Centro",
                    CEP = 30160041,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9234,
                    Longitude = -43.9392,
                    OqFazer = "Assistir a espetáculos musicais, peças de teatro ou mostras de cinema alternativo.",
                    Dicas = "Fique de olho no site oficial deles, pois muitos eventos têm ingressos a preços populares.",
                    PqVisitar = "Um dos espaços culturais mais modernos e ativos localizados no hipercentro de BH.",
                    ImagemUrl = "https://www.minasgerais.com.br/imagens/atracoes/1542284694Euy5sOet5H.jpg",
                    AvaliacaoNota = 4.6,
                    TotalLikes = 95,
                    TotalComentarios = 14,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                },
                new Local
                {
                    Id = 10,
                    Nome = "Rua do Amendoim",
                    Categoria = "Curiosidade Local",
                    Resumo = "Famosa rua ladeira acima onde os carros, quando deixados em ponto morto, parecem subir a rua sozinhos devido a uma ilusão de ótica.",
                    Rua = "Rua Professor Otávio Coelho Magalhães",
                    Numero = 10,
                    Bairro = "Mangabeiras",
                    CEP = 30210300,
                    Cidade = "Belo Horizonte",
                    Latitude = -19.9431,
                    Longitude = -43.9149,
                    OqFazer = "Colocar o carro em ponto morto (desligado) e testar a famosa ilusão de ótica.",
                    Dicas = "Faça o teste com cuidado e pisca-alerta ligado para avisar outros motoristas.",
                    PqVisitar = "É um clássico folclórico de mistério e diversão que diverte turistas e moradores há décadas.",
                    ImagemUrl = "https://media-cdn.tripadvisor.com/media/photo-s/07/5c/ec/4e/rua-do-amendoim.jpg",
                    AvaliacaoNota = 4.3,
                    TotalLikes = 110,
                    TotalComentarios = 55,
                    DataCadastro = new DateTime(2026, 1, 1),
                    Ativo = true
                }
            );*/
        }
    }
}