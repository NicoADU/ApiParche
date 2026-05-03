using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class RegisterDTO
    {

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        public string Password { get; set; } = null!;

        [Required]
        [MinLength(4, ErrorMessage = "El nombre debe tener al menos 4 caracteres")]
        public string Nombre { get; set; } = null!;

        public string Programa { get; set; } = null!;

        public string? UrlAvatar { get; set; }
    }
}