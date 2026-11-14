using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pawsy.Models;

namespace Pawsy.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext(options)
{
    public DbSet<ProductCategory>? ProductCategories => Set<ProductCategory>();
    public DbSet<Product>? Products => Set<Product>();
}
