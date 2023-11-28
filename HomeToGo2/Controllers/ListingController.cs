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
            return BadRequest("Invalid listing data.");
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetListingbyId(int id)
    {
        var listing = await _listingRepository.GetListingById(id);
        if (listing == null)
        {
            _logger.LogError("[ListingController] Listing list not found while executing _listingRepository.GetAll()");
            return NotFound("Listing list not found");
        }
        return Ok(listing);
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(Listing newListing)
    {
        if (newListing == null)
        {
            return BadRequest("Invalid listing data.");
        }
        bool returnOk = await _listingRepository.Update(newListing);
        if (returnOk)
        {
            var response = new { success = true, message = "Listing " + newListing.Title + " updated successfully" };
            return Ok(response);
        }
        else
        {
            var response = new { success = false, message = "Listing creation failed" };
            return Ok(response);
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteListing(int id)
    {
        bool returnOk = await _listingRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[ListingController] Listing deletion failed for the ListingId {ListingId:0000}", id);
            return BadRequest("Listing deletion failed");
        }
        var response = new { success = true, message = "Listing " + id.ToString() + " deleted successfully" };
        return Ok(response);
    }


}
