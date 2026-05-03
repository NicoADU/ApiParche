using ApiParche.Interfaces;
using ApiParche.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiParche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ParcheController : ControllerBase
    {
        private readonly IParcheService _parcheService;

        public ParcheController(IParcheService parcheService)
        {
            _parcheService = parcheService;
        }

        private Guid GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userId!);
        }

        [HttpPost]
        public async Task<IActionResult> CreateParche(CreateParcheDTO dto)
        {
            var userId = GetUserId();

            var parche = await _parcheService.CreateParcheAsync(userId, dto);

            return Ok(parche);
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinParche(JoinParcheDTO dto)
        {
            var userId = GetUserId();

            await _parcheService.JoinParcheAsync(userId, dto);

            return Ok(new { message = "Te uniste al parche correctamente" });
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyParches()
        {
            var userId = GetUserId();

            var parches = await _parcheService.GetUserParchesAsync(userId);

            return Ok(parches);
        }
    }
}