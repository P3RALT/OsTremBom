using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "locais",
                newName: "longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "locais",
                newName: "latitude");

            migrationBuilder.RenameColumn(
                name: "endereco",
                table: "locais",
                newName: "rua");

            migrationBuilder.AddColumn<int>(
                name: "CEP",
                table: "locais",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cidade",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "bairro",
                table: "locais",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "numero",
                table: "locais",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Centro", 30184, "Belo Horizonte", -19.9231932, -43.942367400000002, 744, "Av. Augusto de Lima" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Centro", 30119, "Belo Horizonte", -19.919608799999999, -43.943818200000003, 600, "Rua Rio de Janeiro" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Centro", 30149, "Belo Horizonte", -19.926608000000002, -43.938341800000003, 1148, "Rua da Bahia" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Santa Tereza", 30670, "Belo Horizonte", -19.9163104, -43.915745800000003, 460, "Rua Alvinópolis" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Pompéia", 30168, "Belo Horizonte", -19.917058399999998, -43.908458199999998, 202, "R. Juramento" });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "bairro", "CEP", "Cidade", "latitude", "longitude", "numero", "rua" },
                values: new object[] { "Carlos Prates", 30570, "Belo Horizonte", -19.916480199999999, -43.951761400000002, 1, "R. Patrocínio" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CEP",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "Cidade",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "bairro",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "numero",
                table: "locais");

            migrationBuilder.RenameColumn(
                name: "longitude",
                table: "locais",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "latitude",
                table: "locais",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "rua",
                table: "locais",
                newName: "endereco");

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Av. Augusto de Lima, 744 - Centro, Belo Horizonte", 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Rua Rio de Janeiro, 600 - Centro, Belo Horizonte", 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Rua da Bahia, 1148 - Centro, Belo Horizonte", 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Rua Almeida Castro, 161 - Santa Tereza, Belo Horizonte", 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Rua Juramento, 202 - Pompeia, Belo Horizonte", 0.0, 0.0 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "endereco", "Latitude", "Longitude" },
                values: new object[] { "Rua Patrocínio, 1 - Carlos Prates, Belo Horizonte", 0.0, 0.0 });
        }
    }
}
