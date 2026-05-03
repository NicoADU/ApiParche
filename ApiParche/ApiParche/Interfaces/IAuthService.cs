using ApiParche.Models.DTOs;

namespace ApiParche.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDTO dto);

        Task<string> LoginAsync(LoginDTO dto);
    }
}