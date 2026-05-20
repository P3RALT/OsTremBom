using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class Imagens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 1,
                column: "imagem_url",
                value: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg/250px-Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 3,
                column: "imagem_url",
                value: "https://www.quintoandar.com.br/guias/wp-content/uploads/2023/04/Praca-da-Liberdade-em-Belo-Horizonte-Foto-Shutterstock.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 4,
                column: "imagem_url",
                value: "https://offloadmedia.feverup.com/belohorizontesecreto.com/wp-content/uploads/2023/08/21122832/mirantes-em-belo-horizonte-1024x683.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "imagem_url", "nome" },
                values: new object[] { "https://historiadofutebol.com/blog/wp-content/uploads/2013/11/092-001-500x330.jpg", "Minerão (Estádio Governador Magalhães Pinto)" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 6,
                column: "imagem_url",
                value: "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/foto-pbh.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 7,
                column: "imagem_url",
                value: "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/praca-do-papa_qu4rto-studio-0056-1_0.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 8,
                column: "imagem_url",
                value: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYgiX-foSy-CNzygiQBc9Z95TOzdbfFNAWA&s");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 9,
                column: "imagem_url",
                value: "https://www.minasgerais.com.br/imagens/atracoes/1542284694Euy5sOet5H.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 10,
                column: "imagem_url",
                value: "https://media-cdn.tripadvisor.com/media/photo-s/07/5c/ec/4e/rua-do-amendoim.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 1,
                column: "imagem_url",
                value: "https://exemplo.com/pampulha1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 3,
                column: "imagem_url",
                value: "https://exemplo.com/liberdade1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 4,
                column: "imagem_url",
                value: "https://exemplo.com/mirante1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 5,
                columns: new[] { "imagem_url", "nome" },
                values: new object[] { "https://exemplo.com/mineirao1.jpg", "Estádio Governador Magalhães Pinto (Mineirão)" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 6,
                column: "imagem_url",
                value: "https://exemplo.com/parque1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 7,
                column: "imagem_url",
                value: "https://exemplo.com/papa1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 8,
                column: "imagem_url",
                value: "https://exemplo.com/inhotim1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 9,
                column: "imagem_url",
                value: "https://exemplo.com/palladium1.jpg");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 10,
                column: "imagem_url",
                value: "https://exemplo.com/amendoim1.jpg");
        }
    }
}
