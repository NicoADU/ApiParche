using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models
{
    public class PlanOption
    {
        [Key]
        public Guid Id { get; set; }

        public string Nombre { get; set; } = null!;

        public Guid PlanId { get; set; }
    }
}