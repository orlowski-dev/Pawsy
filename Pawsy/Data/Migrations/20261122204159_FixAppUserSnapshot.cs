using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pawsy.Data.Migrations
{
    public partial class FixAppUserSnapshot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // FullName istnieje już w bazie danych.
            // Migracja synchronizuje historię modelu.
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Nie usuwamy FullName, ponieważ ta migracja
            // nie utworzyła tej kolumny.
        }
    }
}
