using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AtualizacaoRelacionamentosTremBom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_comentarios_publicacoes_PublicacaoId",
                table: "comentarios");

            migrationBuilder.DropForeignKey(
                name: "FK_comentarios_usuarios_UsuarioId",
                table: "comentarios");

            migrationBuilder.DropForeignKey(
                name: "FK_likes_usuarios_UsuarioId",
                table: "likes");

            migrationBuilder.DropForeignKey(
                name: "FK_seguidores_usuarios_AlvoUsuarioId",
                table: "seguidores");

            migrationBuilder.DropForeignKey(
                name: "FK_seguidores_usuarios_UsuarioId",
                table: "seguidores");

            migrationBuilder.RenameColumn(
                name: "UsuarioId",
                table: "seguidores",
                newName: "usuario_id");

            migrationBuilder.RenameColumn(
                name: "AlvoUsuarioId",
                table: "seguidores",
                newName: "alvo_usuario_id");

            migrationBuilder.RenameIndex(
                name: "IX_seguidores_UsuarioId",
                table: "seguidores",
                newName: "IX_seguidores_usuario_id");

            migrationBuilder.RenameIndex(
                name: "IX_seguidores_AlvoUsuarioId",
                table: "seguidores",
                newName: "IX_seguidores_alvo_usuario_id");

            migrationBuilder.RenameColumn(
                name: "FotoUrl",
                table: "publicacoes_fotos",
                newName: "foto_url");

            migrationBuilder.RenameColumn(
                name: "UsuarioId",
                table: "comentarios",
                newName: "usuario_id");

            migrationBuilder.RenameColumn(
                name: "PublicacaoId",
                table: "comentarios",
                newName: "publicacao_id");

            migrationBuilder.RenameIndex(
                name: "IX_comentarios_UsuarioId",
                table: "comentarios",
                newName: "IX_comentarios_usuario_id");

            migrationBuilder.RenameIndex(
                name: "IX_comentarios_PublicacaoId",
                table: "comentarios",
                newName: "IX_comentarios_publicacao_id");

            migrationBuilder.CreateIndex(
                name: "IX_GrupoMembros_UsuarioId",
                table: "GrupoMembros",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_comentarios_publicacoes_publicacao_id",
                table: "comentarios",
                column: "publicacao_id",
                principalTable: "publicacoes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_comentarios_usuarios_usuario_id",
                table: "comentarios",
                column: "usuario_id",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GrupoMembros_usuarios_UsuarioId",
                table: "GrupoMembros",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_likes_usuarios_UsuarioId",
                table: "likes",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_seguidores_usuarios_alvo_usuario_id",
                table: "seguidores",
                column: "alvo_usuario_id",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_seguidores_usuarios_usuario_id",
                table: "seguidores",
                column: "usuario_id",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_comentarios_publicacoes_publicacao_id",
                table: "comentarios");

            migrationBuilder.DropForeignKey(
                name: "FK_comentarios_usuarios_usuario_id",
                table: "comentarios");

            migrationBuilder.DropForeignKey(
                name: "FK_GrupoMembros_usuarios_UsuarioId",
                table: "GrupoMembros");

            migrationBuilder.DropForeignKey(
                name: "FK_likes_usuarios_UsuarioId",
                table: "likes");

            migrationBuilder.DropForeignKey(
                name: "FK_seguidores_usuarios_alvo_usuario_id",
                table: "seguidores");

            migrationBuilder.DropForeignKey(
                name: "FK_seguidores_usuarios_usuario_id",
                table: "seguidores");

            migrationBuilder.DropIndex(
                name: "IX_GrupoMembros_UsuarioId",
                table: "GrupoMembros");

            migrationBuilder.RenameColumn(
                name: "usuario_id",
                table: "seguidores",
                newName: "UsuarioId");

            migrationBuilder.RenameColumn(
                name: "alvo_usuario_id",
                table: "seguidores",
                newName: "AlvoUsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_seguidores_usuario_id",
                table: "seguidores",
                newName: "IX_seguidores_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_seguidores_alvo_usuario_id",
                table: "seguidores",
                newName: "IX_seguidores_AlvoUsuarioId");

            migrationBuilder.RenameColumn(
                name: "foto_url",
                table: "publicacoes_fotos",
                newName: "FotoUrl");

            migrationBuilder.RenameColumn(
                name: "usuario_id",
                table: "comentarios",
                newName: "UsuarioId");

            migrationBuilder.RenameColumn(
                name: "publicacao_id",
                table: "comentarios",
                newName: "PublicacaoId");

            migrationBuilder.RenameIndex(
                name: "IX_comentarios_usuario_id",
                table: "comentarios",
                newName: "IX_comentarios_UsuarioId");

            migrationBuilder.RenameIndex(
                name: "IX_comentarios_publicacao_id",
                table: "comentarios",
                newName: "IX_comentarios_PublicacaoId");

            migrationBuilder.AddForeignKey(
                name: "FK_comentarios_publicacoes_PublicacaoId",
                table: "comentarios",
                column: "PublicacaoId",
                principalTable: "publicacoes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_comentarios_usuarios_UsuarioId",
                table: "comentarios",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_likes_usuarios_UsuarioId",
                table: "likes",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seguidores_usuarios_AlvoUsuarioId",
                table: "seguidores",
                column: "AlvoUsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_seguidores_usuarios_UsuarioId",
                table: "seguidores",
                column: "UsuarioId",
                principalTable: "usuarios",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
