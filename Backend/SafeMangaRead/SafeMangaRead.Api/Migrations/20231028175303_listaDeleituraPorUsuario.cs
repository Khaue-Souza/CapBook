using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class listaDeleituraPorUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NomeManga",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NomeManga",
                table: "listasDeLeitura");
        }
    }
}
