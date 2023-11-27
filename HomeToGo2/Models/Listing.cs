using System;
using System.Text.Json.Serialization;

namespace HomeToGo2.Models;

public class Listing
{
	[JsonPropertyName("ListingId")]
	public int ListingId { get; set; }

    [JsonPropertyName("Title")]
    public string Title { get; set; }

    [JsonPropertyName("Address")]
    public string Address { get; set; }

    [JsonPropertyName("Price")]
    public decimal Price { get; set; }

    [JsonPropertyName("Description")]
    public string? Description { get; set; }

    [JsonPropertyName("ImageUrl")]
    public string? ImageUrl { get; set; }
	
}


