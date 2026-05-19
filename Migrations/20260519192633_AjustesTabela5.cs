using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106);

            migrationBuilder.DropColumn(
                name: "nome_completo",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "telefone",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "termos_aceitos_em",
                table: "usuarios");

            migrationBuilder.AddColumn<DateTime>(
                name: "aniversario",
                table: "usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "nickname",
                table: "usuarios",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "aniversario",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "nickname",
                table: "usuarios");

            migrationBuilder.AddColumn<string>(
                name: "nome_completo",
                table: "usuarios",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "telefone",
                table: "usuarios",
                type: "TEXT",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "termos_aceitos_em",
                table: "usuarios",
                type: "TEXT",
                nullable: true);

            migrationBuilder.InsertData(
                table: "locais",
                columns: new[] { "id", "ativo", "avaliacao_nota", "bairro", "CEP", "categoria", "Cidade", "data_cadastro", "descricao", "dicas", "horario_texto", "imagem_url", "imagem_url_2", "imagem_url_3", "latitude", "longitude", "nome", "numero", "oq_fazer", "pq_visitar", "rua", "total_comentarios", "total_likes" },
                values: new object[,]
                {
                    { 101, true, 4.7999999999999998, "Centro", 30184, "Edifício Gastronômico", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "O clássico: fígado com jiló, queijos premiados e o melhor doce de leite.", "Vá cedo nos finais de semana para evitar multidões e não deixe de visitar a loja de queijos do Mário.", "Segunda a Sábado: 07:00 - 18:00", "https://viajenaweb.com/wp-content/uploads/2016/12/O-que-fazer-no-Mercado-Central-de-Belo-Horizonte-768x432.jpg.webp", null, null, -19.922800800000001, -43.9430665, "Mercado Central", 744, "Comprar queijos, doces, artesanatos e provar o famoso fígado com jiló.", "É considerado um dos melhores mercados do mundo e a alma da cultura mineira.", "Av. Augusto de Lima", 0, 0 },
                    { 102, true, 3.7999999999999998, "Centro", 29264, "Edifício Gastronômico", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cozinha de raiz, bares artesanais e um ambiente retrô industrial incrível.", "O segundo andar é onde a 'magia' acontece. Experimente o Gin da Lamparina.", "Quinta-feira: 08:00 - 18:00", "https://www.hojeemdia.com.br/image/policy:1.992457.1702919772:1702919772/image.jpg?f=2x1&w=1200", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/3f/e2/0d/mercado-novo.jpg", "https://bhaz.com.br/wp-content/uploads/2019/07/mercado-novo-bh-1.jpg", -19.9205766, -43.945760100000001, "Mercado Novo", 499, "Visitar bares de cerveja artesanal, destilarias e comer comida de raiz.", "Um espaço que une o retrô industrial com o que há de mais moderno na gastronomia de BH.", "Rua Rio Grande do Sul", 0, 0 },
                    { 103, true, 4.5, "Centro", 30149, "Edifício Gastronômico", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Varandas icônicas e bares históricos no centro de BH.", "A Cantina do Lucas é patrimônio histórico e fica no térreo.", "Terça a Domingo: 11:00 - 00:00", "https://resize.casapino.com.br/?u=https://cms-bomgourmet.s3.amazonaws.com/bomgourmet/2018/10/201810/maletta-belo-horizonte-varanda-20f288a0.jpg&w=661", null, null, -19.924856900000002, -43.937781899999997, "Edifício Maletta", 1148, "Tomar um café, visitar sebos e curtir a noite nas varandas do segundo andar.", "Ponto de encontro boêmio histórico de intelectuais e artistas de Minas.", "Rua da Bahia", 0, 0 },
                    { 104, true, 4.9000000000000004, "Santa Tereza", 30670, "Bar", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "O bar mais antigo de BH, patrimônio do bairro Santa Tereza.", "Chegue antes do pôr do sol para garantir uma mesa na calçada.", "Todos os dias: 09:00 - 22:00", "https://folhadesetelagoas.com.br/images/noticias/190/9f40c1539471322fcf360b2a9be33a36.jpeg", null, null, -19.916283700000001, -43.910841400000002, "Bar do Orlando", 460, "Tomar cerveja gelada no copo americano e comer o petisco de linguiça.", "Fundado em 1919, é o bar mais antigo em funcionamento contínuo de BH.", "Rua Alvinópolis", 0, 0 },
                    { 105, true, 4.7000000000000002, "Pompéia", 30168, "Bar", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cervejaria local com clima de calçada e muita mineiridade.", "O local é pequeno e a galera fica na rua, o clima é super descontraído.", "Quarta a Domingo: 17:00 - 23:00", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/04/71/ad/img-20181005-wa0018-largejpg.jpg?w=1000&h=-1&s=1", null, null, -19.916995100000001, -43.903569699999998, "Juramento 202", 202, "Degustar chopes artesanais da Viela e ouvir música brasileira.", "Representa o renascimento dos bares de bairro com foco em qualidade artesanal.", "R. Juramento", 0, 0 },
                    { 106, true, 4.5999999999999996, "Carlos Prates", 30570, "Pizzaria", "Belo Horizonte", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pizzaria charmosa em um casarão dos anos 30 com vista panorâmica.", "Tente pegar um lugar na varanda para ver as luzes de BH à noite.", "Terça a Domingo: 18:00 - 23:30", "https://andadireito.com.br/wp-content/uploads/2025/12/Forno-da-Saudade-5.png", null, null, -19.9164776, -43.949180200000001, "Forno da Saudade", 1, "Comer pizzas individuais de longa fermentação com vista para a cidade.", "A localização em um casarão antigo no alto de uma colina proporciona uma experiência única.", "R. Patrocínio", 0, 0 }
                });
        }
    }
}
