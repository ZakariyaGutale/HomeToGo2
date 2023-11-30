using HomeToGo2.Controllers;
using HomeToGo2.DAL;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Xunit;

namespace UnitTesting
{
    public class ListingControllerTest
    {
        private readonly Mock<IListingRepository> _mockRepo;
        private readonly Mock<ILogger<ListingController>> _mockLogger;
        private readonly ListingController _controller;

        public ListingControllerTest()
        {
            _mockRepo = new Mock<IListingRepository>();
            _mockLogger = new Mock<ILogger<ListingController>>();
            _controller = new ListingController(_mockRepo.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsAllListings()
        {
            // Arrange
            var listings = new List<Listing>
            {
                new Listing { ListingId = 1, Title = "Test Listing 1", Address = "123 Test Street", Price = 500, Description = "Description 1", ImageUrl = "assets/Images/test1.jpg" },
                new Listing { ListingId = 2, Title = "Test Listing 2", Address = "456 Test Avenue", Price = 750, Description = "Description 2", ImageUrl = "assets/Images/test2.jpg" }
            };
            _mockRepo.Setup(repo => repo.GetAll()).ReturnsAsync(listings);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Listing>>(actionResult.Value);
            Assert.Equal(listings, returnValue);
        }

        [Fact]
        public async Task GetAll_Fail()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetAll()).ReturnsAsync(() => null);

            // Act
            var result = await _controller.GetAll();

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Create_Success_ReturnsOkWithSuccessMessage()
        {
            // Arrange
            var newListing = new Listing
            {
                ListingId = 1,
                Title = "Test Listing",
                Address = "123 Test Street",
                Price = 500,
                Description = "A test listing description",
                ImageUrl = "assets/Images/test.jpg"
            };
            _mockRepo.Setup(repo => repo.Create(newListing)).ReturnsAsync(true);

            // Act
            var result = await _controller.Create(newListing);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var response = new RouteValueDictionary(actionResult.Value);
            Assert.True((bool)response["success"]);
            Assert.Equal("Listing " + newListing.Title + " created successfully", response["message"]);
        }

        [Fact]
        public async Task Create_Failure_ReturnsOkWithFailureMessage()
        {
            // Arrange
            var newListing = new Listing
            {
                ListingId = 1,
                Title = "Test Listing",
                Address = "123 Test Street",
                Price = 500,
                Description = "A test listing description",
                ImageUrl = "assets/Images/test.jpg"
            };
            _mockRepo.Setup(repo => repo.Create(newListing)).ReturnsAsync(false);

            // Act
            var result = await _controller.Create(newListing);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var response = new RouteValueDictionary(actionResult.Value);
            Assert.False((bool)response["success"]);
            Assert.Equal("Listing creation failed", response["message"]);
        }

        [Fact]
        public async Task Create_InvalidInput_ReturnsBadRequest()
        {
            // Act
            var result = await _controller.Create(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
        
        [Fact]
    public async Task GetListingById_Success_ReturnsListing()
    {
        var sampleListing = new Listing 
        { 
            ListingId = 1, 
            Title = "Sample Listing", 
            Address = "123 Main St", 
            Price = 1000, 
            Description = "Sample Description", 
            ImageUrl = "sample-image.jpg"
        };
        _mockRepo.Setup(repo => repo.GetListingById(1)).ReturnsAsync(sampleListing);

        var result = await _controller.GetListingbyId(1);

        var actionResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(sampleListing, actionResult.Value);
    }

    // Not found case
    [Fact]
    public async Task GetListingById_NotFound_ReturnsNotFound()
    {
        _mockRepo.Setup(repo => repo.GetListingById(It.IsAny<int>())).ReturnsAsync(() => null);

        var result = await _controller.GetListingbyId(1);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // Tests for Update
    // Success case
    
    [Fact]
    public async Task Update_Success_ReturnsSuccessMessage()
    {
        var sampleListingToUpdate = new Listing 
        { 
            ListingId = 1, 
            Title = "Updated Listing", 
            Address = "123 Main St", 
            Price = 1500, 
            Description = "Updated Description", 
            ImageUrl = "updated-image.jpg"
        };
        _mockRepo.Setup(repo => repo.Update(sampleListingToUpdate)).ReturnsAsync(true);

        var result = await _controller.Update(sampleListingToUpdate);

        var actionResult = Assert.IsType<OkObjectResult>(result);
        var response = new RouteValueDictionary(actionResult.Value);
        Assert.True((bool)response["success"]);
        Assert.Equal("Listing updated successfully", response["message"]);
    }

    // Failure case
    [Fact]
    public async Task Update_Failure_ReturnsFailureMessage()
    {
        var sampleListingToUpdate = new Listing 
        { 
            ListingId = 1, 
            Title = "Updated Listing", 
            Address = "123 Main St", 
            Price = 1500, 
            Description = "Updated Description", 
            ImageUrl = "updated-image.jpg"
        };
        _mockRepo.Setup(repo => repo.Update(sampleListingToUpdate)).ReturnsAsync(false);

        var result = await _controller.Update(sampleListingToUpdate);

        var actionResult = Assert.IsType<OkObjectResult>(result);
        var response = new RouteValueDictionary(actionResult.Value);
        Assert.False((bool)response["success"]);
        Assert.Equal("Listing update failed", response["message"]);
    }

    

    // Invalid input case
    [Fact]
    public async Task Update_InvalidInput_ReturnsBadRequest()
    {
        var result = await _controller.Update(null);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    // Tests for DeleteListing
    // Success case
    [Fact]
    public async Task DeleteListing_Failure_ReturnsFailureMessage()
    {
        _mockRepo.Setup(repo => repo.Delete(1)).ReturnsAsync(false);

        var result = await _controller.DeleteListing(1);

        Assert.IsType<BadRequestObjectResult>(result);
    }
    
    [Fact]
    public async Task DeleteListing_Success_ReturnsSuccessMessage()
    {
        _mockRepo.Setup(repo => repo.Delete(1)).ReturnsAsync(true);

        var result = await _controller.DeleteListing(1);

        var actionResult = Assert.IsType<OkObjectResult>(result);
        var response = new RouteValueDictionary(actionResult.Value);
        Assert.True((bool)response["success"]);
        Assert.Equal("Listing 1 deleted successfully", response["message"]);
    }

        
        
    }
}
