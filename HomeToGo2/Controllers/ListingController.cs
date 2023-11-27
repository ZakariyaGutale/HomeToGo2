using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HomeToGo2.Models;
using HomeToGo2.DAL;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HomeToGo2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingController : Controller
{

    private readonly IListingRepository _listingRepository;
    private readonly ILogger<ListingController> _logger;

    public ListingController(IListingRepository listingRepository, ILogger<ListingController> logger)
    {
        _listingRepository = listingRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var listings = await _listingRepository.GetAll();
        if (listings == null)
        {
            _logger.LogError("[ListingController] Listing list not found while executing _listingRepository.GetAll()");
            return NotFound("Listing list not found");
        }
        return Ok(listings);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] Listing newListing)
    {
        if (newListing == null)
        {
            return BadRequest("Invalid item data.");
        }

        bool returnOk = await _listingRepository.Create(newListing);

        if (returnOk)
        {
            var response = new { success = true, message = "Listing " + newListing.Title + " created successfully" };
            return Ok(response);
        }
        else
        {
            var response = new { success = false, message = "Listing creation failed" };
            return Ok(response);
        }
    }

    /*

    private static int GetNextListingId()
    {
        if (Listings.Count == 0)
        {
            return 1;
        }
        return Listings.Max(Listing => Listing.ListingId) + 1;
    }
    */


}
