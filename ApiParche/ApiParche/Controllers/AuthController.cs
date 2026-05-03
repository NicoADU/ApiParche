using ApiParche.Interfaces;
using ApiParche.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ApiParche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            try
            {
                var token = await _authService.RegisterAsync(dto);

                return Ok(new
                {
                    message = "Usuario registrado correctamente",
                    token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            try
            {
                var token = await _authService.LoginAsync(dto);

                return Ok(new
                {
                    message = "Login exitoso",
                    token
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new
                {
                    error = ex.Message
                });
            }
        }
    }
}