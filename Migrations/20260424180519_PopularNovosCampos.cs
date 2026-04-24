using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class PopularNovosCampos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dicas",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "endereco",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "oq_fazer",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pq_visitar",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "dicas", "endereco", "oq_fazer", "pq_visitar" },
                values: new object[] { "Vá cedo nos finais de semana para evitar multidões e não deixe de visitar a loja de queijos do Mário.", "Av. Augusto de Lima, 744 - Centro, Belo Horizonte", "Comprar queijos, doces, artesanatos e provar o famoso fígado com jiló.", "É considerado um dos melhores mercados do mundo e a alma da cultura mineira." });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "dicas", "endereco", "oq_fazer", "pq_visitar" },
                values: new object[] { "O segundo andar é onde a 'magia' acontece. Experimente o Gin da Lamparina.", "Rua Rio de Janeiro, 600 - Centro, Belo Horizonte", "Visitar bares de cerveja artesanal, destilarias e comer comida de raiz.", "Um espaço que une o retrô industrial com o que há de mais moderno na gastronomia de BH." });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "categoria", "dicas", "endereco", "oq_fazer", "pq_visitar" },
                values: new object[] { "Edifício Gastronômico", "A Cantina do Lucas é patrimônio histórico e fica no térreo.", "Rua da Bahia, 1148 - Centro, Belo Horizonte", "Tomar um café, visitar sebos e curtir a noite nas varandas do segundo andar.", "Ponto de encontro boêmio histórico de intelectuais e artistas de Minas." });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "dicas", "endereco", "imagem_url", "oq_fazer", "pq_visitar" },
                values: new object[] { "Chegue antes do pôr do sol para garantir uma mesa na calçada.", "Rua Almeida Castro, 161 - Santa Tereza, Belo Horizonte", "https://folhadesetelagoas.com.br/images/noticias/190/9f40c1539471322fcf360b2a9be33a36.jpeg", "Tomar cerveja gelada no copo americano e comer o petisco de linguiça.", "Fundado em 1919, é o bar mais antigo em funcionamento contínuo de BH." });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "categoria", "dicas", "endereco", "oq_fazer", "pq_visitar" },
                values: new object[] { "Bar", "O local é pequeno e a galera fica na rua, o clima é super descontraído.", "Rua Juramento, 202 - Pompeia, Belo Horizonte", "Degustar chopes artesanais da Viela e ouvir música brasileira.", "Representa o renascimento dos bares de bairro com foco em qualidade artesanal." });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "dicas", "endereco", "oq_fazer", "pq_visitar" },
                values: new object[] { "Tente pegar um lugar na varanda para ver as luzes de BH à noite.", "Rua Patrocínio, 1 - Carlos Prates, Belo Horizonte", "Comer pizzas individuais de longa fermentação com vista para a cidade.", "A localização em um casarão antigo no alto de uma colina proporciona uma experiência única." });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dicas",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "endereco",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "oq_fazer",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "pq_visitar",
                table: "locais");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                column: "categoria",
                value: "Edifício Gastronômico/Bar");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                column: "imagem_url",
                value: "https://folhadesetelagoas.com/images/noticias/190/9f40c1539471322fcf360b2a9be33a36.jpeg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                column: "categoria",
                value: "Bar Artesanal");
        }
    }
}
