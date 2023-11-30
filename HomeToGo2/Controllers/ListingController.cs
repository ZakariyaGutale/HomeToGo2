// Importing necessary namespaces and libraries
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HomeToGo2.Models;
using HomeToGo2.DAL;
using Microsoft.AspNetCore.Authorization;

// Defining the namespace for the controllers
namespace HomeToGo2.Controllers;

// Setting up the controller as an API controller with a route pattern
[ApiController]
[Route("api/[controller]")]
public class ListingController : Controller
{
    // Declaration of the listing repository and logger interfaces
    private readonly IListingRepository _listingRepository;
    private readonly ILogger<ListingController> _logger;

    // Constructor for the ListingController
    public ListingController(IListingRepository listingRepository, ILogger<ListingController> logger)
    {
        _listingRepository = listingRepository;
        _logger = logger;
    }

    // HTTP GET method to retrieve all listings
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Retrieving all listings and returning them
        var listings = await _listingRepository.GetAll();
        if (listings == null)
        {
            // Logging and handling the case where listings are not found
            _logger.LogError("[ListingController] Listing list not found while executing _listingRepository.GetAll()");
            return NotFound("Listing list not found");
        }
        return Ok(listings);
    }

    // HTTP POST method for creating a new listing
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] Listing newListing)
    {
        // Validating the input
        if (newListing == null)
        {
            return BadRequest("Invalid listing data.");
        }

        // Creating the listing and handling the response
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

    // HTTP GET method to retrieve a listing by its ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetListingbyId(int id)
    {
        // Retrieving the listing by ID
        var listing = await _listingRepository.GetListingById(id);
        if (listing == null)
        {
            // Logging and handling the case where the listing is not found
            _logger.LogError("[ListingController] Listing list not found while executing _listingRepository.GetAll()");
            return NotFound("Listing list not found");
        }
        return Ok(listing);
    }

    // HTTP PUT method for updating a listing
    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(Listing newListing)
    {
        // Validating the input
        if (newListing == null)
        {
            return BadRequest("Invalid listing data.");
        }
        // Updating the listing and handling the response
        bool returnOk = await _listingRepository.Update(newListing);
        if (returnOk)
        {
            var response = new { success = true, message = "Listing updated successfully" };
            return Ok(response);
        }
        else
        {
            var response = new { success = false, message = "Listing update failed" };
            return Ok(response);
        }
    }

    // HTTP DELETE method for deleting a listing by ID
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteListing(int id)
    {
        // Deleting the listing and handling the response
        bool returnOk = await _listingRepository.Delete(id);
        if (!returnOk)
        {
            // Logging and handling the failure of deletion
            _logger.LogError("[ListingController] Listing deletion failed for the ListingId {ListingId:0000}", id);
            return BadRequest("Listing deletion failed");
        }
        var response = new { success = true, message = "Listing " + id.ToString() + " deleted successfully" };
        return Ok(response);
    }
}
