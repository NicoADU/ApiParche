using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class AddOptionDTO
    {
        [Required]
        public string Nombre { get; set; } = null!;

        [Required]
        public Guid PlanId { get; set; }
    }
}