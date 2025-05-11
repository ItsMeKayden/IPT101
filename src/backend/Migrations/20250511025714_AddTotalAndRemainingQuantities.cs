using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalAndRemainingQuantities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RemainingLarge",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RemainingMedium",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RemainingSmall",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalLarge",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalMedium",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSmall",
                table: "ProductSizes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RemainingLarge",
                table: "ProductSizes");

            migrationBuilder.DropColumn(
                name: "RemainingMedium",
                table: "ProductSizes");

            migrationBuilder.DropColumn(
                name: "RemainingSmall",
                table: "ProductSizes");

            migrationBuilder.DropColumn(
                name: "TotalLarge",
                table: "ProductSizes");

            migrationBuilder.DropColumn(
                name: "TotalMedium",
                table: "ProductSizes");

            migrationBuilder.DropColumn(
                name: "TotalSmall",
                table: "ProductSizes");
        }
    }
}
