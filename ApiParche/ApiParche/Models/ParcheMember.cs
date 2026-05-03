public class ParcheMember
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public Guid ParcheId { get; set; }

    public string Role { get; set; } = "member";

    public Parche Parche { get; set; } = null!;
}