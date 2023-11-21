using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class atualizandoTabelaDeLeitura1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Autor",
                table: "listasDeLeitura");

            migrationBuilder.RenameColumn(
                name: "Idioma",
                table: "listasDeLeitura",
                newName: "Banner");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Banner",
                table: "listasDeLeitura",
                newName: "Idioma");

            migrationBuilder.AddColumn<string>(
                name: "Autor",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
