using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class TransformarLocalOpcional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes");

            migrationBuilder.AlterColumn<int>(
                name: "LocalId",
                table: "publicacoes",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes",
                column: "LocalId",
                principalTable: "locais",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes");

            migrationBuilder.AlterColumn<int>(
                name: "LocalId",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes",
                column: "LocalId",
                principalTable: "locais",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
