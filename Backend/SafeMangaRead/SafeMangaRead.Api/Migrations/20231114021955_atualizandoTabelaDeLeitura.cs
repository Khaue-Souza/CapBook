using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class atualizandoTabelaDeLeitura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnoDePublicacao",
                table: "listasDeLeitura",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Autor",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Genero",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Idioma",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomesAlternativos",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaisDeOrigem",
                table: "listasDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnoDePublicacao",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "Autor",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "Genero",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "Idioma",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "Images",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "NomesAlternativos",
                table: "listasDeLeitura");

            migrationBuilder.DropColumn(
                name: "PaisDeOrigem",
                table: "listasDeLeitura");
        }
    }
}
