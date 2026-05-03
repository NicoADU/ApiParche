using ApiParche.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ApiParche.DAO
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Parche> Parches { get; set; }
        public DbSet<ParcheMember> ParcheMembers { get; set; }
        public DbSet<Plan> Plans { get; set; }
        public DbSet<PlanOption> PlanOptions { get; set; }
        public DbSet<Vote> Votes { get; set; }

        public DbSet<PlanVote> PlanVotes { get; set; }
    

    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ParcheMember>()
                .HasOne(pm => pm.Parche)
                .WithMany(p => p.Members)
                .HasForeignKey(pm => pm.ParcheId);
        }
    } }