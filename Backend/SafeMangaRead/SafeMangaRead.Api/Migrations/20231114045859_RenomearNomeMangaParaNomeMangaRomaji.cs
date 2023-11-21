using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenomearNomeMangaParaNomeMangaRomaji : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NomeManga",
                table: "listasDeLeitura",
                newName: "NomeMangaRomaji");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NomeMangaRomaji",
                table: "listasDeLeitura",
                newName: "NomeManga");
        }
    }
}
