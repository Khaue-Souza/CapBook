using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class ListaDeLeitura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListaDeLeitura",
                columns: table => new
                {
                    ListaDeLeituraId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    MangaId = table.Column<int>(type: "int", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListaDeLeitura");
        }
    }
}
