using System;
using HomeToGo2.Models;

using Microsoft.EntityFrameworkCore;


namespace HomeToGo2.DAL;

public class ListingDbContext : DbContext
{
    public ListingDbContext(DbContextOptions<ListingDbContext> options) : base(options)
    {
        //Database.EnsureCreated();
    }

    public DbSet<Listing> Listings { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }


}