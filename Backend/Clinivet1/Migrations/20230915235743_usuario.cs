using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinivet1.Migrations
{
    public partial class usuario : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioCargo",
                table: "usuarios");

            migrationBuilder.RenameColumn(
                name: "UsuarioLogin",
                table: "usuarios",
                newName: "UsuarioEmail");

            migrationBuilder.AddColumn<DateTime>(
                name: "UsuarioNascimento",
                table: "usuarios",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioNascimento",
                table: "usuarios");

            migrationBuilder.RenameColumn(
                name: "UsuarioEmail",
                table: "usuarios",
                newName: "UsuarioLogin");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioCargo",
                table: "usuarios",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
