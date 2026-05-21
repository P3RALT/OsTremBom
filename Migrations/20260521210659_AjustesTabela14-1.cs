using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela141 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "data_publicacao",
                table: "publicacoes",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "data_publicacao",
                table: "publicacoes");
        }
    }
}
