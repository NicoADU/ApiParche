using ApiParche.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Parche
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Nombre { get; set; } = null!;

    public string Descripcion { get; set; } = null!;

    public string? ImagenPortada { get; set; }

    public string CodigoInvitacion { get; set; } = null!;

    public Guid OwnerId { get; set; }

    [JsonIgnore]
    public ICollection<ParcheMember> Members { get; set; } = new List<ParcheMember>();
}