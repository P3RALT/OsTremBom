using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_locais_local_id",
                table: "publicacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_usuarios_usuario_id",
                table: "publicacoes");

            migrationBuilder.DropTable(
                name: "comentarios");

            migrationBuilder.DropTable(
                name: "publicacoes_fotos");

            migrationBuilder.DropTable(
                name: "publicacoes_likes");

            migrationBuilder.DropColumn(
                name: "ativo",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "data_atualizacao",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "data_criacao",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "feedback",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "local_nome",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "rating",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "total_comentarios",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "total_compartilhamentos",
                table: "publicacoes");

            migrationBuilder.DropColumn(
                name: "total_likes",
                table: "publicacoes");

            migrationBuilder.RenameColumn(
                name: "usuario_id",
                table: "publicacoes",
                newName: "UsuarioId");

            migrationBuilder.RenameColumn(
                name: "local_id",
                table: "publicacoes",
                newName: "LocalId");

            migrationBuilder.RenameIndex(
                name: "IX_publicacoes_usuario_id",
                table: "publicacoes",
                newName: "IX_publicacoes_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_publicacoes_local_id",
                table: "publicacoes",
                newName: "IX_publicacoes_LocalId");

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes",
                column: "LocalId",
                principalTable: "locais",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_usuarios_UsuarioId",
                table: "publicacoes",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_locais_LocalId",
                table: "publicacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_publicacoes_usuarios_UsuarioId",
                table: "publicacoes");

            migrationBuilder.RenameColumn(
                name: "UsuarioId",
                table: "publicacoes",
                newName: "usuario_id");

            migrationBuilder.RenameColumn(
                name: "LocalId",
                table: "publicacoes",
                newName: "local_id");

            migrationBuilder.RenameIndex(
                name: "IX_publicacoes_UsuarioId",
                table: "publicacoes",
                newName: "IX_publicacoes_usuario_id");

            migrationBuilder.RenameIndex(
                name: "IX_publicacoes_LocalId",
                table: "publicacoes",
                newName: "IX_publicacoes_local_id");

            migrationBuilder.AddColumn<bool>(
                name: "ativo",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "data_atualizacao",
                table: "publicacoes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "data_criacao",
                table: "publicacoes",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "feedback",
                table: "publicacoes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "local_nome",
                table: "publicacoes",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "rating",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "total_comentarios",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "total_compartilhamentos",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "total_likes",
                table: "publicacoes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "comentarios",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    publicacao_id = table.Column<int>(type: "INTEGER", nullable: false),
                    usuario_id = table.Column<int>(type: "INTEGER", nullable: false),
                    ativo = table.Column<bool>(type: "INTEGER", nullable: false),
                    data_atualizacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    data_criacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    texto = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comentarios", x => x.id);
                    table.ForeignKey(
                        name: "FK_comentarios_publicacoes_publicacao_id",
                        column: x => x.publicacao_id,
                        principalTable: "publicacoes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comentarios_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "publicacoes_fotos",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    publicacao_id = table.Column<int>(type: "INTEGER", nullable: false),
                    foto_url = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    ordem = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_publicacoes_fotos", x => x.id);
                    table.ForeignKey(
                        name: "FK_publicacoes_fotos_publicacoes_publicacao_id",
                        column: x => x.publicacao_id,
                        principalTable: "publicacoes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "publicacoes_likes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    publicacao_id = table.Column<int>(type: "INTEGER", nullable: false),
                    usuario_id = table.Column<int>(type: "INTEGER", nullable: false),
                    data_like = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_publicacoes_likes", x => x.id);
                    table.ForeignKey(
                        name: "FK_publicacoes_likes_publicacoes_publicacao_id",
                        column: x => x.publicacao_id,
                        principalTable: "publicacoes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_publicacoes_likes_usuarios_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_publicacao_id",
                table: "comentarios",
                column: "publicacao_id");

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_usuario_id",
                table: "comentarios",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_publicacoes_fotos_publicacao_id",
                table: "publicacoes_fotos",
                column: "publicacao_id");

            migrationBuilder.CreateIndex(
                name: "IX_publicacoes_likes_publicacao_id",
                table: "publicacoes_likes",
                column: "publicacao_id");

            migrationBuilder.CreateIndex(
                name: "IX_publicacoes_likes_usuario_id",
                table: "publicacoes_likes",
                column: "usuario_id");

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_locais_local_id",
                table: "publicacoes",
                column: "local_id",
                principalTable: "locais",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_publicacoes_usuarios_usuario_id",
                table: "publicacoes",
                column: "usuario_id",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
