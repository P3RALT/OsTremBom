using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AtualizarDadosLocais : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "avaliacao_nota",
                table: "locais",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "horario_texto",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url_2",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url_3",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "avaliacao_nota", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 4.7999999999999998, "Segunda a Sábado: 07:00 - 18:00", null, null });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "avaliacao_nota", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 3.7999999999999998, "Quinta-feira: 08:00 - 18:00", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/3f/e2/0d/mercado-novo.jpg", "https://bhaz.com.br/wp-content/uploads/2019/07/mercado-novo-bh-1.jpg" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "avaliacao_nota", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 4.5, "Terça a Domingo: 11:00 - 00:00", null, null });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "avaliacao_nota", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 4.9000000000000004, "Todos os dias: 09:00 - 22:00", null, null });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "avaliacao_nota", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 4.7000000000000002, "Quarta a Domingo: 17:00 - 23:00", null, null });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "avaliacao_nota", "categoria", "descricao", "horario_texto", "imagem_url_2", "imagem_url_3" },
                values: new object[] { 4.5999999999999996, "Pizzaria", "Pizzaria charmosa em um casarão dos anos 30 com vista panorâmica.", "Terça a Domingo: 18:00 - 23:30", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "avaliacao_nota",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "horario_texto",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "imagem_url_2",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "imagem_url_3",
                table: "locais");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "categoria", "descricao" },
                values: new object[] { "Pizarria", "é uma pizzaria badalada e charmosa, localizada em um casarão dos anos 30 no bairro Carlos Prates, em Belo Horizonte, com vista panorâmica da cidade e ambiente de praça" });
        }
    }
}
