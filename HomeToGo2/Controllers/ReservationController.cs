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

        public ReservationController(ListingDbContext listingDbContext)
        {
            _listingDbContext = listingDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _listingDbContext.Reservations
                .Include(r => r.Listing) 
                .ToListAsync();
            return Ok(reservations);
        }


        [HttpPost("create")]
        public async Task<ActionResult<Reservation>> CreateReservation([FromBody] Reservation reservation)
        {
            if (reservation == null)
            {
                return BadRequest("Reservation data is null");
            }

            try
            {
                var listing = await _listingDbContext.Listings.FindAsync(reservation.ListingId);
                if (listing == null)
                {
                    return BadRequest("Invalid ListingId in Reservation");
                }

                if (await IsReservationOverlap(reservation))
                {
                    return BadRequest("The selected dates are already booked for this listing.");
                }

                TimeSpan stayDuration = reservation.CheckOutDate - reservation.CheckInDate;
                reservation.TotalPrice = listing.Price * stayDuration.Days;

                _listingDbContext.Reservations.Add(reservation);
                await _listingDbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservations), new { id = reservation.ReservationId }, reservation);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e}");
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

        private async Task<bool> IsReservationOverlap(Reservation reservation)
        {
            return await _listingDbContext.Reservations.AnyAsync(r =>
                r.ListingId == reservation.ListingId &&
                r.ReservationId != reservation.ReservationId &&
                ((reservation.CheckInDate < r.CheckOutDate && reservation.CheckInDate >= r.CheckInDate) ||
                 (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));
        }
    }
}
