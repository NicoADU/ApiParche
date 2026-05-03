using ApiParche.Models;
using ApiParche.Models.DTOs;

namespace ApiParche.Interfaces
{
    public interface IPlanService
    {
        Task<Plan> CreatePlanAsync(Guid userId, CreatePlanDTO dto);

        Task AddOptionAsync(AddOptionDTO dto);

        Task VoteAsync(Guid userId, VoteDTO dto);

        Task<List<PlanResultDTO>> GetResultsAsync(Guid planId);
    }
}