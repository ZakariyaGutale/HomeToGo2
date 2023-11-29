
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;


namespace HomeToGo2.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        ListingDbContext context = serviceScope.ServiceProvider.GetRequiredService<ListingDbContext>();
        //context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        var oleUser = new IdentityUser { UserName = "Ole Hansen", Email = "ole.hansen@email.no", PasswordHash = "HashedPassword1", EmailConfirmed = true }; 
        var kariUser = new IdentityUser { UserName = "Kari Johansen", Email = "kari.johansen@email.no", PasswordHash = "HashedPassword2", EmailConfirmed = true }; 
        var larsUser = new IdentityUser { UserName = "Lars Olsen", Email = "lars.olsen@email.no", PasswordHash = "HashedPassword3", EmailConfirmed = true }; 

        if (!context.Users.Any(u => u.UserName == oleUser.UserName))
        {
            context.Users.Add(oleUser);
        }
        if (!context.Users.Any(u => u.UserName == kariUser.UserName))
        {
            context.Users.Add(kariUser);
        }
        if (!context.Users.Any(u => u.UserName == larsUser.UserName))
        {
            context.Users.Add(larsUser);
        }
        
        context.SaveChanges();

        if (!context.Listings.Any())
        {
            var listings = new List<Listing>
            {
                new Listing()
                {
                    ListingId = 1,
                    Title = "Tjuvholem, Penthouse",
                    Address = "Osloveien 36",
                    Price = 1200,
                    Description = "This apartment at Tjuvholmen impresses with its modern style and exclusive location, right by Oslo’s waterfront",
                    ImageUrl = "assets/Images/Ap1.jpg"
                },
             
   
                new Listing
                {
                    ListingId = 2,
                    Title = "Modern Apartment in Pilestredet",
                    Address = "Pilistredet 32",
                    Price = 400,
                    Description = "This modern apartment in Pilestredet is perfect for those who wish to live centrally in Oslo.",
                    ImageUrl = "assets/Images/Ap3.jpg"
                },
                new Listing
                {
                    ListingId = 3,
                    Title = "Montebello, Villa",
                    Address = "Montebello gate 1",
                    Price = 2500,
                    Description = "This spacious villa in Montebello combines luxury and comfort..",
                    ImageUrl = "assets/Images/Ap4.jpg"
                },
                new Listing
                {
                    ListingId = 4,
                    Title = "Frogener, Hageby",
                    Address = "Frogner Veien 43",
                    Price = 1600,
                    Description = "Single-family homes in Frogner Hageby in Oslo are renowned for their idyllic and lush atmosphere.",
                    ImageUrl = "assets/Images/Ap5.jpg"
                },
                new Listing
                {
                    ListingId = 5,
                    Title = "Zanzibar, Beach house",
                    Address = "Zanzi 73",
                    Price = 3500,
                    Description = "This beach house in Zanzibar offers stunning ocean views, perfect for a relaxing holiday..",
                    ImageUrl = "assets/Images/Ap6.jpg"
                },
            
   
   
            };
            
            context.AddRange(listings);
            context.SaveChanges();
        }
        
        if (!context.Reservations.Any())
        {
            var reservations = new List<Reservation> 
            {
                new Reservation()
                {
                    ReservationId = 1,
                    ListingId = 1, 
                    CheckInDate = DateTime.Now.AddDays(1),
                    CheckOutDate = DateTime.Now.AddDays(7),
                    TotalPrice = 700 
                },
                new Reservation()
                {
                    ReservationId = 2,
                    ListingId = 3, 
                    CheckInDate = DateTime.Now.AddDays(1),
                    CheckOutDate = DateTime.Now.AddDays(3),
                    TotalPrice = 700 
                },
                new Reservation()
                {
                    ReservationId = 3,
                    ListingId = 5, 
                    CheckInDate = DateTime.Now.AddDays(1),
                    CheckOutDate = DateTime.Now.AddDays(5),
                    TotalPrice = 700 
                }
            }; 

            context.AddRange(reservations);
            context.SaveChanges();
        }

    }
}
