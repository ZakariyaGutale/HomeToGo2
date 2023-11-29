using HomeToGo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HomeToGo2.DAL;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeToGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly ListingDbContext _listingDbContext;
        private readonly ILogger<ReservationController> _logger;

        public ReservationController(ListingDbContext listingDbContext, ILogger<ReservationController> logger)
        {
            _listingDbContext = listingDbContext;
            _logger = logger;
        }
        
        private async Task CalculateTotalPrice(Reservation reservation)
        {
            // Validations
            if (reservation == null) throw new ArgumentNullException(nameof(reservation), "Reservation cannot be null");
            if (reservation.ListingId == null) throw new ArgumentException("Reservation must have a ListingId");

            var listing = await _listingDbContext.Listings.FindAsync(reservation.ListingId);
            if (listing == null) throw new ArgumentException("Invalid ListingId in Reservation");

            // Calculate total price
            TimeSpan stayDuration = reservation.CheckOutDate - reservation.CheckInDate;
            reservation.TotalPrice = listing.Price * stayDuration.Days;
        }
        
        private async Task<bool> IsReservationOverlap(Reservation reservation)
        {
            return await _listingDbContext.Reservations.AnyAsync(r =>
                r.ListingId == reservation.ListingId &&
                r.ReservationId != reservation.ReservationId &&
                ((reservation.CheckInDate < r.CheckOutDate && reservation.CheckInDate >= r.CheckInDate) ||
                 (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _listingDbContext.Reservations.Include(r => r.Listing).ToListAsync();
            foreach (var reservation in reservations) await CalculateTotalPrice(reservation);
            return Ok(reservations);
        }

        [HttpPost("createReservation")]
        public async Task<ActionResult<Reservation>> CreateReservation([FromBody]  Reservation newReservation)
        {
            
            ModelState.Remove("Listing");
            
            if (newReservation == null)
            {
                return BadRequest("Reservation data is null.");
            }
            
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState)
                {
                    _logger.LogError($"Error in {error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                }

                return BadRequest(ModelState);
            }

            // Attempt to find the listing associated with the ListingId
            var listing = await _listingDbContext.Listings.FindAsync(newReservation.ListingId);
            if (listing == null)
            {
                return BadRequest("Invalid ListingId in Reservation.");
            }
            // Optional: Check for date overlap
            if (await IsReservationOverlap(newReservation))
            {
                return BadRequest("The selected dates are already booked for this listing.");
            }
            // Calculate total price based on the listing's price and the duration of stay
            TimeSpan stayDuration = newReservation.CheckOutDate - newReservation.CheckInDate;
            newReservation.TotalPrice = listing.Price * stayDuration.Days;

            try
            {
                _listingDbContext.Reservations.Add(newReservation);
                await _listingDbContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReservations), new { id = newReservation.ReservationId }, newReservation);
            }
            catch (Exception e)
            {
                // Log the exception details
                _logger.LogError($"Error creating reservation: {e.Message}");
                return StatusCode(500, "Internal server error occurred.");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _listingDbContext.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _listingDbContext.Reservations.Remove(reservation);
            await _listingDbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}
