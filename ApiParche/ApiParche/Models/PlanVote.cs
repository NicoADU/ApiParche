namespace ApiParche.Models
{
    public class PlanVote
    {
        public Guid Id { get; set; }

        public Guid PlanId { get; set; }
        public Plan Plan { get; set; } = null!;

        public Guid UserId { get; set; }

        public string Opcion { get; set; } = null!;
    }
}