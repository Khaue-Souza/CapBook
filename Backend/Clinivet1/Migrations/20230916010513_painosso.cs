using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinivet1.Migrations
{
    public partial class painosso : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "testeeeeadawdawdadsdd",
                table: "usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "testeeeeadawdawdadsdd",
                table: "usuarios");
        }
    }
}
