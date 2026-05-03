using ApiParche.DAO;
using ApiParche.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ApiParche.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await context.Database.MigrateAsync();


            var email = "admin@parche.com";

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    UserName = email,
                    Nombre = "Admin",
                    Programa = "Ingeniería",
                    UrlAvatar = null
                };

                var result = await userManager.CreateAsync(user, "Admin123!");

                if (!result.Succeeded)
                {
                    throw new Exception("Error creando usuario admin");
                }
            }

   

            if (!await context.Parches.AnyAsync())
            {
                var parche = new Parche
                {
                    Id = Guid.NewGuid(),
                    Nombre = "Parche Inicial",
                    Descripcion = "Parche creado automáticamente",
                    CodigoInvitacion = GenerateInviteCode(),
                    OwnerId = user.Id
                };

                await context.Parches.AddAsync(parche);

                // Crear miembro owner
                var member = new ParcheMember
                {
                    Id = Guid.NewGuid(),
                    ParcheId = parche.Id,
                    UserId = user.Id,
                    Role = "owner"
                };

                await context.ParcheMembers.AddAsync(member);

                await context.SaveChangesAsync();
            }
        }

        

        private static string GenerateInviteCode()
        {
            return Guid.NewGuid()
                .ToString("N")
                .Substring(0, 6)
                .ToUpper();
        }
    }
}