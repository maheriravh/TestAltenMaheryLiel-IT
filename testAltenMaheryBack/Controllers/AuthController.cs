using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using testAltenMaheryBack.Data.Entities;
using testAltenMaheryBack.Dtos;
using testAltenMaheryBack.Services;

namespace testAltenMaheryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userSvc;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _pwdHasher;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userSvc = userService;
            _configuration = configuration;
            _pwdHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto model)
        {
            var user = await _userSvc.AuthenticateAsync(model.Login, model.Password);
            if (user == null)
                return Unauthorized();

            var claims = new[]
                {
                    new Claim(ClaimTypes.Name, model.Login),
                    new Claim(ClaimTypes.Role, user.Role_user)
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                user = user.Login,
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = user.Role_user
            });

        }
    }
}
