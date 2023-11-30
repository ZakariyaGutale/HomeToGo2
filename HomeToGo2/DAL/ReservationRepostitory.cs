using HomeToGo2.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Namespace for Data Access Layer
namespace HomeToGo2.DAL
{
    // Implementation of the IReservationRepository interface
    public class ReservationRepository : IReservationRepository
    {
        // DbContext for accessing the database
        private readonly ListingDbContext _dbContext;

        // Constructor injecting the DbContext
        public ReservationRepository(ListingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Method to create a new reservation asynchronously
        public async Task<bool> Create(Reservation reservation)
        {
            // Find the listing associated with the reservation
            var listing = await _dbContext.Listings.FindAsync(reservation.ListingId);
            // If listing doesn't exist, return false
            if (listing == null) return false;

            // Calculate the total price of the reservation
            CalculateTotalPrice(reservation, listing);

            // Check for overlapping reservations
            if (await IsReservationOverlap(reservation)) return false;

            // Add the new reservation to the DbContext and save changes
            _dbContext.Reservations.Add(reservation);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        // Method to retrieve all reservations asynchronously
        public async Task<IEnumerable<Reservation>> GetAll()
        {
            // Include related Listing entities and retrieve all reservations
            return await _dbContext.Reservations.Include(r => r.Listing).ToListAsync();
        }

        // Method to delete a reservation by its ID asynchronously
        public async Task<bool> Delete(int id)
        {
            // Find the reservation by ID
            var reservation = await _dbContext.Reservations.FindAsync(id);
            // If not found, return false
            if (reservation == null) return false;

            // Remove the reservation from the DbContext and save changes
            _dbContext.Reservations.Remove(reservation);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        // Private helper method to calculate the total price of a reservation
        private void CalculateTotalPrice(Reservation reservation, Listing listing)
        {
            // Calculate the duration of the stay
            TimeSpan stayDuration = reservation.CheckOutDate - reservation.CheckInDate;
            // Set the total price based on the listing's price and stay duration
            reservation.TotalPrice = listing.Price * stayDuration.Days;
        }

        // Method to check for overlapping reservations asynchronously
        public async Task<bool> IsReservationOverlap(Reservation reservation)
        {
            // Check if any reservation overlaps with the given reservation's dates
            return await _dbContext.Reservations.AnyAsync(r =>
                r.ListingId == reservation.ListingId &&
                r.ReservationId != reservation.ReservationId &&
                ((reservation.CheckInDate < r.CheckOutDate && reservation.CheckInDate >= r.CheckInDate) ||
                 (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));
        }
    }
}
