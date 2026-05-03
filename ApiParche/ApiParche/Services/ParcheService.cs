using ApiParche.DAO;
using ApiParche.Interfaces;
using ApiParche.Models;
using ApiParche.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ApiParche.Services
{
    public class ParcheService : IParcheService
    {
        private readonly ApplicationDbContext _context;

        public ParcheService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Parche> CreateParcheAsync(Guid userId, CreateParcheDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var parche = new Parche
                {
                    Id = Guid.NewGuid(),
                    Nombre = dto.Nombre,
                    Descripcion = dto.Descripcion,
                    CodigoInvitacion = GenerateInviteCode(),
                    OwnerId = userId
                };

                await _context.Parches.AddAsync(parche);
                await _context.SaveChangesAsync();

                var member = new ParcheMember
                {
                    Id = Guid.NewGuid(),
                    ParcheId = parche.Id,
                    UserId = userId,
                    Role = "owner"
                };

                await _context.ParcheMembers.AddAsync(member);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return parche;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Error creando parche: {ex.Message}", ex);
            }
        }

        public async Task JoinParcheAsync(Guid userId, JoinParcheDTO dto)
        {
            var exists = await _context.ParcheMembers
                .AnyAsync(m => m.ParcheId == dto.ParcheId && m.UserId == userId);

            if (exists)
            {
                throw new Exception("El usuario ya pertenece a este parche");
            }

            var member = new ParcheMember
            {
                Id = Guid.NewGuid(),
                ParcheId = dto.ParcheId,
                UserId = userId
            };

            await _context.ParcheMembers.AddAsync(member);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Parche>> GetUserParchesAsync(Guid userId)
        {
            var parches = await _context.Parches
                .Where(p => _context.ParcheMembers
                    .Any(m => m.ParcheId == p.Id && m.UserId == userId))
                .ToListAsync();

            return parches;
        }

        private string GenerateInviteCode()
        {
            return Guid.NewGuid()
                .ToString("N")
                .Substring(0, 6)
                .ToUpper();
        }
    }
}