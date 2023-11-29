using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HomeToGo2.DAL;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HomeToGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        // Dependency injection of DbContext and Logger
        private readonly ListingDbContext _listingDbContext;
        private readonly ILogger<ReservationController> _logger;

        public ReservationController(ListingDbContext listingDbContext, ILogger<ReservationController> logger)
        {
            _listingDbContext = listingDbContext;
            _logger = logger;
        }
        
        // Calculate total price for a reservation
        private async Task CalculateTotalPrice(Reservation reservation)
        {
            // Validation checks
            if (reservation == null) throw new ArgumentNullException(nameof(reservation), "Reservation cannot be null");
            if (reservation.ListingId == null) throw new ArgumentException("Reservation must have a ListingId");

            // Fetching the listing from the database
            var listing = await _listingDbContext.Listings.FindAsync(reservation.ListingId);
            if (listing == null) throw new ArgumentException("Invalid ListingId in Reservation");

            // Calculate total price
            TimeSpan stayDuration = reservation.CheckOutDate - reservation.CheckInDate;
            reservation.TotalPrice = listing.Price * stayDuration.Days;
        }
        
        // Check if the new reservation overlaps with existing reservations
        private async Task<bool> IsReservationOverlap(Reservation reservation)
        {
            // Query the database to find any overlapping reservations
            return await _listingDbContext.Reservations.AnyAsync(r =>
                r.ListingId == reservation.ListingId &&
                r.ReservationId != reservation.ReservationId &&
                // Date overlap conditions
                ((reservation.CheckInDate < r.CheckOutDate && reservation.CheckInDate >= r.CheckInDate) ||
                 (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));
        }

        // GET method to retrieve all reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            // Fetch all reservations including related listings
            var reservations = await _listingDbContext.Reservations.Include(r => r.Listing).ToListAsync();
            // Calculate the total price for each reservation
            foreach (var reservation in reservations) await CalculateTotalPrice(reservation);
            return Ok(reservations);
        }

        // POST method to create a new reservation
        [HttpPost("createReservation")]
        public async Task<ActionResult<Reservation>> CreateReservation([FromBody] Reservation newReservation)
        {
            // Remove unnecessary ModelState entries
            ModelState.Remove("Listing");
            
            // Validate the input reservation object
            if (newReservation == null)
            {
                return BadRequest("Reservation data is null.");
            }
            
            // Check if ModelState is valid
            if (!ModelState.IsValid)
            {
                // Log model state errors
                foreach (var error in ModelState)
                {
                    _logger.LogError($"Error in {error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                }

                return BadRequest(ModelState);
            }

            // Validate and process the new reservation
            var listing = await _listingDbContext.Listings.FindAsync(newReservation.ListingId);
            if (listing == null)
            {
                return BadRequest("Invalid ListingId in Reservation.");
            }
            // Check for overlapping reservations
            if (await IsReservationOverlap(newReservation))
            {
                return BadRequest("The selected dates are already booked for this listing.");
            }
            // Calculate the total price for the reservation
            TimeSpan stayDuration = newReservation.CheckOutDate - newReservation.CheckInDate;
            newReservation.TotalPrice = listing.Price * stayDuration.Days;

            try
            {
                // Add the reservation to the database and save changes
                _listingDbContext.Reservations.Add(newReservation);
                await _listingDbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReservations), new { id = newReservation.ReservationId }, newReservation);
            }
            catch (Exception e)
            {
                // Log any exceptions that occur
                _logger.LogError($"Error creating reservation: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        // DELETE method to remove a reservation
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            // Find the reservation in the database
            var reservation = await _listingDbContext.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            // Remove the reservation and save changes
            _listingDbContext.Reservations.Remove(reservation);
            await _listingDbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}
