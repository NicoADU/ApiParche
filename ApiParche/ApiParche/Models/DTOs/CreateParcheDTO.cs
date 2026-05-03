using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class CreateParcheDTO
    {
        [Required]
        [MinLength(3)]
        public string Nombre { get; set; } = null!;

        public string? Descripcion { get; set; }
    }
}