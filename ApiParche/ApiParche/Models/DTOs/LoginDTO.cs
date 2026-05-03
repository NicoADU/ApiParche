using System.ComponentModel.DataAnnotations;

namespace ApiParche.Models.DTOs
{
    public class LoginDTO
    {

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string Password { get; set; } = null!;
    }
}