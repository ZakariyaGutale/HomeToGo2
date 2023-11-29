using System;
using HomeToGo2.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace HomeToGo2.DAL;

public class ListingDbContext : IdentityDbContext<IdentityUser>
{
    public ListingDbContext(DbContextOptions<ListingDbContext> options) : base(options)
    {
        //Database.EnsureCreated();
    }

    public DbSet<Listing> Listings { get; set; }
    public DbSet<Reservation> Reservations { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }


}