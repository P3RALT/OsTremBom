using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.922800800000001, -43.9430665 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.924856900000002, -43.937781899999997 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.916283700000001, -43.910841400000002 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.916995100000001, -43.903569699999998 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.9164776, -43.949180200000001 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 101,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.9231932, -43.942367400000002 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 103,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.926608000000002, -43.938341800000003 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 104,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.9163104, -43.915745800000003 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 105,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.917058399999998, -43.908458199999998 });

            migrationBuilder.UpdateData(
                table: "locais",
                keyColumn: "id",
                keyValue: 106,
                columns: new[] { "latitude", "longitude" },
                values: new object[] { -19.916480199999999, -43.951761400000002 });
        }
    }
}
