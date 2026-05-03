using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiParche.Migrations
{
    /// <inheritdoc />
    public partial class ListoElPollo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ParcheMembers_ParcheId",
                table: "ParcheMembers",
                column: "ParcheId");

            migrationBuilder.AddForeignKey(
                name: "FK_ParcheMembers_Parches_ParcheId",
                table: "ParcheMembers",
                column: "ParcheId",
                principalTable: "Parches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ParcheMembers_Parches_ParcheId",
                table: "ParcheMembers");

            migrationBuilder.DropIndex(
                name: "IX_ParcheMembers_ParcheId",
                table: "ParcheMembers");
        }
    }
}
