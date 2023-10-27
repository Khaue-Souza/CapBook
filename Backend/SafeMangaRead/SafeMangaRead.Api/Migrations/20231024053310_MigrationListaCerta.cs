using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SafeMangaRead.Api.Migrations
{
    /// <inheritdoc />
    public partial class MigrationListaCerta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataConclusao",
                table: "ListaDeLeitura",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataInicio",
                table: "ListaDeLeitura",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notas",
                table: "ListaDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProgressoCapitulo",
                table: "ListaDeLeitura",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "StatusManga",
                table: "ListaDeLeitura",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataConclusao",
                table: "ListaDeLeitura");

            migrationBuilder.DropColumn(
                name: "DataInicio",
                table: "ListaDeLeitura");

            migrationBuilder.DropColumn(
                name: "Notas",
                table: "ListaDeLeitura");

            migrationBuilder.DropColumn(
                name: "ProgressoCapitulo",
                table: "ListaDeLeitura");

            migrationBuilder.DropColumn(
                name: "StatusManga",
                table: "ListaDeLeitura");
        }
    }
}
