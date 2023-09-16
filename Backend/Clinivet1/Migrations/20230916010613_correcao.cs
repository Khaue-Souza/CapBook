using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinivet1.Migrations
{
    public partial class correcao : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "testeeeeadawdawdadsdd",
                table: "usuarios");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "testeeeeadawdawdadsdd",
                table: "usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
