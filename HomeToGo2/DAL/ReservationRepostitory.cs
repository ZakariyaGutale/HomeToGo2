using HomeToGo2.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeToGo2.DAL
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ListingDbContext _dbContext;

        public ReservationRepository(ListingDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Create(Reservation reservation)
        {
            var listing = await _dbContext.Listings.FindAsync(reservation.ListingId);
            if (listing == null) return false;

            CalculateTotalPrice(reservation, listing);

            if (await IsReservationOverlap(reservation)) return false;

            _dbContext.Reservations.Add(reservation);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Reservation>> GetAll()
        {
            return await _dbContext.Reservations.Include(r => r.Listing).ToListAsync();
        }

        public async Task<bool> Delete(int id)
        {
            var reservation = await _dbContext.Reservations.FindAsync(id);
            if (reservation == null) return false;

            _dbContext.Reservations.Remove(reservation);
            return await _dbContext.SaveChangesAsync() > 0;
        }

        private void CalculateTotalPrice(Reservation reservation, Listing listing)
        {
            TimeSpan stayDuration = reservation.CheckOutDate - reservation.CheckInDate;
            reservation.TotalPrice = listing.Price * stayDuration.Days;
        }

        private async Task<bool> IsReservationOverlap(Reservation reservation)
        {
            return await _dbContext.Reservations.AnyAsync(r =>
                r.ListingId == reservation.ListingId &&
                r.ReservationId != reservation.ReservationId &&
                ((reservation.CheckInDate < r.CheckOutDate && reservation.CheckInDate >= r.CheckInDate) ||
                 (reservation.CheckOutDate > r.CheckInDate && reservation.CheckOutDate <= r.CheckOutDate)));
        }
    }
}
