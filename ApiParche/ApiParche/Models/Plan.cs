using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models
{
    public class Plan
    {
        [Key]
        public Guid Id { get; set; }

        public string Titulo { get; set; } = null!;

        public string? Descripcion { get; set; }

        public Guid ParcheId { get; set; }

        public Guid CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}