namespace ApiParche.Models
{
    public class Attendance
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }

        public Guid PlanId { get; set; }

        public string Status { get; set; } = "talvez";
    }
}