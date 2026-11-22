using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pawsy.Models;

namespace Pawsy.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<AppUser>(options)
{
    public DbSet<ProductCategory>? ProductCategories => Set<ProductCategory>();
    public DbSet<ProductSubcategory>? ProductSubcategories => Set<ProductSubcategory>();
    public DbSet<Product>? Products => Set<Product>();
}
