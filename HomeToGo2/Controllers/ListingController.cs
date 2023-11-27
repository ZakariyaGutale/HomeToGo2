using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HomeToGo2.Models;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeToGo2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingController : Controller
{
    private static List<Listing> Listings = new List<Listing>()
    {
         new Listing()
                {
                    ListingId = 1,
                    Title = "Tjuvholem, Penthouse",
                    Address = "Osloveien 36",
                    Price = 1200,
                    Description = "This apartment at Tjuvholmen impresses with its modern style and exclusive location, right by Oslo’s waterfront",
                    ImageUrl = "./assets/Images/Ap1.jpg"
         },


         new Listing
         {
             ListingId = 2,
             Title = "Modern Apartment in Pilestredet",
             Address = "Pilistredet 32",
             Price = 400,
             Description = "This modern apartment in Pilestredet is perfect for those who wish to live centrally in Oslo.\"",
             ImageUrl = "./assets/Images/Ap3.jpg"
         },
         new Listing
         {
             ListingId = 3,
             Title = "Montebello, Villa",
             Address = "Montebello gate 1",
             Price = 2500,
             Description = "This spacious villa in Montebello combines luxury and comfort..",
             ImageUrl = "./assets/Images/Ap4.jpg"
         },
         new Listing
         {
             ListingId = 4,
             Title = "Frogener, Hageby",
             Address = "Frogner Veien 43",
             Price = 1600,
             Description = "Single-family homes in Frogner Hageby in Oslo are renowned for their idyllic and lush atmosphere.",
             ImageUrl = "./assets/Images/Ap5.jpg"
         },
         new Listing
         {
             ListingId = 5,
             Title = "Zanzibar, Beach house",
             Address = "Zanzi 73",
             Price = 3500,
             Description = "This beach house in Zanzibar offers stunning ocean views, perfect for a relaxing holiday..",
             ImageUrl = "./assets/Images/Ap6.jpg"
         },
    };

    [HttpGet]
    public List<Listing> GetAll()
    {
        return Listings;
    }


}
