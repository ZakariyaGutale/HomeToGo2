// Importing required namespaces and libraries
using HomeToGo2.DAL;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

// Define the namespace for the controllers
namespace HomeToGo.Controllers
{
    // Annotating the class as an API controller and setting up the route pattern
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        // Declaration of the reservation repository and logger interfaces
        private readonly IReservationRepository _reservationRepository;
        private readonly ILogger<ReservationController> _logger;

        // Constructor for the ReservationController
        public ReservationController(IReservationRepository reservationRepository, ILogger<ReservationController> logger)
        {
            _reservationRepository = reservationRepository;
            _logger = logger;
        }

        // HTTP GET method to retrieve reservations
        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            try
            {
                // Retrieving all reservations and returning them
                var reservations = await _reservationRepository.GetAll();
                return Ok(reservations);
            }
            catch (Exception e)
            {
                // Logging and handling exceptions
                _logger.LogError($"Error retrieving reservations: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        // HTTP POST method for creating a new reservation
        [HttpPost("createReservation")]
        public async Task<ActionResult<Reservation>> CreateReservation([FromBody] Reservation newReservation)
        {
            // Validating the input
            if (newReservation == null)
            {
                return BadRequest("Reservation data is null.");
            }

            try
            {
                // Creating the reservation and handling the response
                var created = await _reservationRepository.Create(newReservation);
                if (!created)
                {
                    return BadRequest("Failed to create the reservation.");
                }

                return CreatedAtAction(nameof(GetReservations), new { id = newReservation.ReservationId }, newReservation);
            }
            catch (Exception e)
            {
                // Logging and handling exceptions
                _logger.LogError($"Error creating reservation: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        // HTTP DELETE method for deleting a reservation by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            try
            {
                // Deleting the reservation and handling the response
                var deleted = await _reservationRepository.Delete(id);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception e)
            {
                // Logging and handling exceptions
                _logger.LogError($"Error deleting reservation with id {id}: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }
    }
}
