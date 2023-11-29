using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    // Dependency injection for UserManager and Configuration
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;

    public AccountController(UserManager<IdentityUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers() {
        // Retrieve all users and select only Id, Email, and Username
        var users = _userManager.Users.Select(u => new {
            Id = u.Id,
            Email = u.Email,
            Username = u.UserName 
        }).ToList();
        return Ok(users);
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        // Check if the model state is valid
        if (ModelState.IsValid)
        {
            // Create a new IdentityUser with the given username and email
            var user = new IdentityUser { UserName = model.UserName, Email = model.Email };
            
            // Attempt to create the user with the given password
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // On successful registration, return a success message
                return Ok(new { message = "User registered successfully" });
            }
            // If there are errors, add them to the ModelState
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }
        // Return bad request if model state is not valid
        return BadRequest(ModelState);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // Check if the user exists and the password is correct
        var user = await _userManager.FindByNameAsync(model.UserName);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            // Generate JWT token for the user
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }
        // Return Unauthorized if the login fails
        return Unauthorized();
    }

    // Method to generate JWT token
    private string GenerateJwtToken(IdentityUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            // Create claims for the token (e.g., user ID)
            Subject = new ClaimsIdentity(new Claim[] 
            {
                new Claim(ClaimTypes.Name, user.Id.ToString())
            }),
            // Set the token expiration date
            Expires = DateTime.UtcNow.AddDays(7),
            // Sign the token with HMAC-SHA256 algorithm
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

// Model class for user registration
public class RegisterModel
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}

// Model class for user login
public class LoginModel
{
    public string UserName { get; set; }
    public string Password { get; set; }
}
