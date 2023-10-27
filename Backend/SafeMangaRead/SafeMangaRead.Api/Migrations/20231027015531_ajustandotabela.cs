using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class ajustandotabela : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListaDeLeitura");

            migrationBuilder.CreateTable(
                name: "listasDeLeitura",
                columns: table => new
                {
                    ListaDeLeituraId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    MangaId = table.Column<int>(type: "int", nullable: false),
                    StatusManga = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProgressoCapitulo = table.Column<int>(type: "int", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataConclusao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notas = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_listasDeLeitura", x => x.ListaDeLeituraId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "listasDeLeitura");

            migrationBuilder.CreateTable(
                name: "ListaDeLeitura",
                columns: table => new
                {
                    ListaDeLeituraId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataConclusao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataInicio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MangaId = table.Column<int>(type: "int", nullable: false),
                    Notas = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProgressoCapitulo = table.Column<int>(type: "int", nullable: false),
                    StatusManga = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListaDeLeitura", x => x.ListaDeLeituraId);
                    table.ForeignKey(
                        name: "FK_ListaDeLeitura_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListaDeLeitura_UsuarioId",
                table: "ListaDeLeitura",
                column: "UsuarioId");
        }
    }
}
