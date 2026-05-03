using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class VoteDTO
    {
        [Required]
        public Guid PlanOptionId { get; set; }
    }
}