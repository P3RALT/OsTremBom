using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sessoes");

            migrationBuilder.AddColumn<string>(
                name: "genero",
                table: "usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ip",
                table: "usuarios",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "genero",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "ip",
                table: "usuarios");

            migrationBuilder.CreateTable(
                name: "sessoes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<int>(type: "INTEGER", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    data_expiracao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    token = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    token_lembrar = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sessoes", x => x.id);
                    table.ForeignKey(
                        name: "FK_sessoes_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_sessoes_usuario_id",
                table: "sessoes",
                column: "usuario_id");
        }
    }
}
