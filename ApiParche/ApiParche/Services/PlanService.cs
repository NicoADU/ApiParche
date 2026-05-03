using ApiParche.DAO;
using ApiParche.Interfaces;
using ApiParche.Models;
using ApiParche.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ApiParche.Services
{
    public class PlanService : IPlanService
    {
        private readonly ApplicationDbContext _context;

        public PlanService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Plan> CreatePlanAsync(Guid userId, CreatePlanDTO dto)
        {
            var plan = new Plan
            {
                Id = Guid.NewGuid(),
                Titulo = dto.Titulo,
                Descripcion = dto.Descripcion,
                ParcheId = dto.ParcheId,
                CreatedBy = userId
            };

            await _context.Plans.AddAsync(plan);
            await _context.SaveChangesAsync();

            return plan;
        }



        public async Task AddOptionAsync(AddOptionDTO dto)
        {
            var exists = await _context.Plans.AnyAsync(p => p.Id == dto.PlanId);

            if (!exists)
                throw new Exception("El plan no existe");

            var option = new PlanOption
            {
                Id = Guid.NewGuid(),
                Nombre = dto.Nombre,
                PlanId = dto.PlanId
            };

            await _context.PlanOptions.AddAsync(option);
            await _context.SaveChangesAsync();
        }

        public async Task VoteAsync(Guid userId, VoteDTO dto)
        {
            var option = await _context.PlanOptions
                .FirstOrDefaultAsync(o => o.Id == dto.PlanOptionId);

            if (option == null)
                throw new Exception("La opción no existe");

            var alreadyVoted = await _context.Votes
                .AnyAsync(v => v.PlanOptionId == dto.PlanOptionId && v.UserId == userId);

            if (alreadyVoted)
                throw new Exception("Ya votaste por esta opción");

            var vote = new Vote
            {
                Id = Guid.NewGuid(),
                PlanOptionId = dto.PlanOptionId,
                UserId = userId
            };

            await _context.Votes.AddAsync(vote);
            await _context.SaveChangesAsync();
        }

        public async Task<List<PlanResultDTO>> GetResultsAsync(Guid planId)
        {
            var results = await _context.PlanVotes
                .Where(v => v.PlanId == planId)
                .GroupBy(v => v.Opcion)
                .Select(g => new PlanResultDTO
                {
                    Opcion = g.Key,
                    Votos = g.Count()
                })
                .ToListAsync();

            return results;
        }
    }
}