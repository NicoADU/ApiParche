using ApiParche.Models;
using ApiParche.Models.DTOs;

namespace ApiParche.Interfaces
{
    public interface IParcheService
    {
        Task<Parche> CreateParcheAsync(Guid userId, CreateParcheDTO dto);

        Task JoinParcheAsync(Guid userId, JoinParcheDTO dto);

        Task<List<Parche>> GetUserParchesAsync(Guid userId);
    }
}