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
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _planService;

        public PlanController(IPlanService planService)
        {
            _planService = planService;
        }

        private Guid GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userId!);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePlan(CreatePlanDTO dto)
        {
            var userId = GetUserId();

            var plan = await _planService.CreatePlanAsync(userId, dto);

            return Ok(plan);
        }

        [HttpPost("add-option")]
        public async Task<IActionResult> AddOption(AddOptionDTO dto)
        {
            await _planService.AddOptionAsync(dto);

            return Ok(new { message = "Opción agregada correctamente" });
        }

        [HttpPost("vote")]
        public async Task<IActionResult> Vote(VoteDTO dto)
        {
            var userId = GetUserId();

            await _planService.VoteAsync(userId, dto);

            return Ok(new { message = "Voto registrado correctamente" });
        }

        [HttpGet("{id}/results")]
        public async Task<IActionResult> GetResults(Guid id)
        {
            var results = await _planService.GetResultsAsync(id);

            return Ok(results);
        }
    }
}