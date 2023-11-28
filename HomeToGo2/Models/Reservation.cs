using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace HomeToGo2.Models
{
    public class Reservation
    {
        [JsonPropertyName("ReservationId")]
        public int ReservationId { get; set; }

        [JsonPropertyName("ReservationDate")]
        public DateTime ReservationDate { get; set; } = DateTime.Today;

      //  [JsonPropertyName("UserId")]
        //public string UserId { get; set; }

      //  [JsonIgnore] 
        //public virtual IdentityUser User { get; set; }

        [JsonPropertyName("ListingId")]
        public int ListingId { get; set; }

        [JsonIgnore] 
        public virtual Listing Listing { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Check-in Date")]
        [JsonPropertyName("CheckInDate")]
        public DateTime CheckInDate { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Check-out Date")]
        [JsonPropertyName("CheckOutDate")]
        public DateTime CheckOutDate { get; set; }

        [JsonPropertyName("TotalPrice")]
        public decimal TotalPrice { get; set; }
    }
}