using Microsoft.AspNetCore.Identity;

namespace ApiParche.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string Nombre { get; set; } = null!;

        public string Programa { get; set; } = null!;

        public string? UrlAvatar { get; set; }
    }
}