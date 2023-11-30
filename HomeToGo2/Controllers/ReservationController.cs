using HomeToGo2.DAL;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace HomeToGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly ILogger<ReservationController> _logger;

        public ReservationController(IReservationRepository reservationRepository, ILogger<ReservationController> logger)
        {
            _reservationRepository = reservationRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            try
            {
                var reservations = await _reservationRepository.GetAll();
                return Ok(reservations);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error retrieving reservations: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        [HttpPost("createReservation")]
        public async Task<ActionResult<Reservation>> CreateReservation([FromBody] Reservation newReservation)
        {
            if (newReservation == null)
            {
                return BadRequest("Reservation data is null.");
            }

            try
            {
                var created = await _reservationRepository.Create(newReservation);
                if (!created)
                {
                    return BadRequest("Failed to create the reservation.");
                }

                return CreatedAtAction(nameof(GetReservations), new { id = newReservation.ReservationId }, newReservation);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error creating reservation: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            try
            {
                var deleted = await _reservationRepository.Delete(id);
                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"Error deleting reservation with id {id}: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }
    }
}
