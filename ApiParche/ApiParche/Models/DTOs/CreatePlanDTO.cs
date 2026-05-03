using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class CreatePlanDTO
    {
        [Required]
        public string Titulo { get; set; } = null!;

        public string? Descripcion { get; set; }

        [Required]
        public Guid ParcheId { get; set; }
    }
}