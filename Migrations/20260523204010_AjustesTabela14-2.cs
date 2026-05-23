using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela142 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "descricao",
                table: "publicacoes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "publicacoes_fotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PublicacaoId = table.Column<int>(type: "INTEGER", nullable: false),
                    FotoUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_publicacoes_fotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_publicacoes_fotos_publicacoes_PublicacaoId",
                        column: x => x.PublicacaoId,
                        principalTable: "publicacoes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_publicacoes_fotos_PublicacaoId",
                table: "publicacoes_fotos",
                column: "PublicacaoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "publicacoes_fotos");

            migrationBuilder.DropColumn(
                name: "descricao",
                table: "publicacoes");
        }
    }
}
