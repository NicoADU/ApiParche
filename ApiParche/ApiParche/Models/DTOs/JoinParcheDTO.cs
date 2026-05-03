using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class JoinParcheDTO
    {
        [Required]
        public Guid ParcheId { get; set; }
    }
}