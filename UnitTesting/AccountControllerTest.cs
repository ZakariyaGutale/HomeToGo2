using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

public class AccountControllerTest
{
    private readonly Mock<UserManager<IdentityUser>> _mockUserManager;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly AccountController _controller;
    private readonly string _testJwtKey = "YourTestSecretKey"; // Make sure this is a valid key

    public AccountControllerTest()
    {
        _mockUserManager = new Mock<UserManager<IdentityUser>>(Mock.Of<IUserStore<IdentityUser>>(), null, null, null, null, null, null, null, null);

        _mockConfiguration = new Mock<IConfiguration>();
        _mockConfiguration.Setup(c => c["Jwt:Key"]).Returns(_testJwtKey);

        _controller = new AccountController(_mockUserManager.Object, _mockConfiguration.Object);
    }

    [Fact]
    public async Task Register_ValidUser_ReturnsSuccess()
    {
        var model = new RegisterModel { Email = "test@example.com", UserName = "testuser", Password = "Password123!" };
        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);

        var result = await _controller.Register(model);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task Register_InvalidModel_ReturnsBadRequest()
    {
        var model = new RegisterModel { Email = "invalidemail", UserName = "testuser", Password = "short" };
        _controller.ModelState.AddModelError("Error", "Invalid model");

        var result = await _controller.Register(model);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var model = new LoginModel { UserName = "testuser", Password = "WrongPassword" };
        _mockUserManager.Setup(x => x.FindByNameAsync(model.UserName)).ReturnsAsync((IdentityUser)null);

        var result = await _controller.Login(model);

        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task GetUsers_ReturnsUserList()
    {
        var testUsers = new List<IdentityUser>
        {
            new IdentityUser { UserName = "user1", Email = "user1@example.com" },
            new IdentityUser { UserName = "user2", Email = "user2@example.com" }
        };
        _mockUserManager.Setup(x => x.Users).Returns(testUsers.AsQueryable());

        var result = await _controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var users = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
        Assert.Equal(2, users.Count());
    }
}
