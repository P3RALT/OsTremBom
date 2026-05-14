using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "CEP", "latitude", "longitude", "numero", "rua" },
                values: new object[] { 29264, -19.9205766, -43.945760100000001, 499, "Rua Rio Grande do Sul" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 102,
                columns: new[] { "CEP", "latitude", "longitude", "numero", "rua" },
                values: new object[] { 30119, -19.919608799999999, -43.943818200000003, 600, "Rua Rio de Janeiro" });
        }
    }
}
