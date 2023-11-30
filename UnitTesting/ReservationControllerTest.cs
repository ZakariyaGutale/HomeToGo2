using HomeToGo.Controllers;
using HomeToGo2.DAL;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace UnitTesting
{
    public class ReservationControllerTest
    {
        private readonly Mock<IReservationRepository> _mockRepository;
        private readonly Mock<ILogger<ReservationController>> _mockLogger;
        private readonly ReservationController _controller;

        public ReservationControllerTest()
        {
            _mockRepository = new Mock<IReservationRepository>();
            _mockLogger = new Mock<ILogger<ReservationController>>();
            _controller = new ReservationController(_mockRepository.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetReservations_ReturnsAllReservations()
        {
            var mockReservations = new List<Reservation> { /* Add test data here */ };
            _mockRepository.Setup(repo => repo.GetAll()).ReturnsAsync(mockReservations);

            var result = await _controller.GetReservations();

            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(mockReservations, actionResult.Value);
        }

        
        [Fact]
        public async Task GetReservations_ReturnsEmptyList_WhenNoReservations()
        {
            // Setup: Mock the repository to return an empty list
            _mockRepository.Setup(repo => repo.GetAll()).ReturnsAsync(new List<Reservation>());

            // Act: Call the GetReservations method
            var result = await _controller.GetReservations();

            // Assert: Check that the result is OkObjectResult with an empty list
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var reservations = Assert.IsAssignableFrom<IEnumerable<Reservation>>(actionResult.Value);
            Assert.Empty(reservations);
        }


        
        [Fact]
        public async Task CreateReservation_ValidData_ReturnsCreated()
        {
            var newReservation = new Reservation { /* Initialize with valid data */ };
            _mockRepository.Setup(repo => repo.Create(newReservation)).ReturnsAsync(true);

            var result = await _controller.CreateReservation(newReservation);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.NotNull(createdAtActionResult);
            // Optionally, you can further assert the value or other properties
        }

        [Fact]
        public async Task CreateReservation_InvalidData_ReturnsBadRequest()
        {
            var newReservation = new Reservation { /* Initialize with invalid data */ };
            _mockRepository.Setup(repo => repo.Create(newReservation)).ReturnsAsync(false);

            var result = await _controller.CreateReservation(newReservation);

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }



        [Fact]
        public async Task DeleteReservation_ExistingId_ReturnsNoContent()
        {
            _mockRepository.Setup(repo => repo.Delete(1)).ReturnsAsync(true);

            var result = await _controller.DeleteReservation(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteReservation_NonExistingId_ReturnsNotFound()
        {
            _mockRepository.Setup(repo => repo.Delete(1)).ReturnsAsync(false);

            var result = await _controller.DeleteReservation(1);

            Assert.IsType<NotFoundResult>(result);
        }

    }
}
