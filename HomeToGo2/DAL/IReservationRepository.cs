using HomeToGo2.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HomeToGo2.DAL
{
    public interface IReservationRepository
    {
        Task<bool> Create(Reservation reservation);
        Task<IEnumerable<Reservation>> GetAll();
        Task<bool> Delete(int id);
    }
}