using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models
{
    public class Vote
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PlanOptionId { get; set; }

        public Guid UserId { get; set; }
    }
}