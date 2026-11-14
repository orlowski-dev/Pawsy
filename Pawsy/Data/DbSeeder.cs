using Microsoft.EntityFrameworkCore;
using Pawsy.Models;

namespace Pawsy.Data;

public static class DbSeeder
{
    public static void Seed(DbContext dbContext, bool _)
    {
        if (!dbContext.Set<ProductCategory>().Any())
            SeedProductCategory(dbContext);

        if (!dbContext.Set<Product>().Any())
            SeedProduct(dbContext);

        dbContext.SaveChanges();
    }

    public static async Task SeedAsync(
        DbContext dbContext,
        bool _,
        CancellationToken cancellationToken
    )
    {
        if (!await dbContext.Set<ProductCategory>().AnyAsync(cancellationToken))
            SeedProductCategory(dbContext);

        if (!await dbContext.Set<Product>().AnyAsync(cancellationToken))
            SeedProduct(dbContext);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static void SeedProductCategory(DbContext dbContext)
    {
        dbContext
            .Set<ProductCategory>()
            .AddRange(
                new ProductCategory { Name = "pies" },
                new ProductCategory { Name = "kot" },
                new ProductCategory { Name = "rybki" },
                new ProductCategory { Name = "ptaki" }
            );
    }

    private static void SeedProduct(DbContext dbContext)
    {
        var dogCategory = dbContext.Set<ProductCategory>().FirstOrDefault((i) => i.Name == "pies");

        ArgumentNullException.ThrowIfNull(dogCategory);

        dbContext
            .Set<Product>()
            .AddRange(
                new Product
                {
                    Name = "Royal Canin Medium Adult",
                    Price = 39.99M,
                    Category = dogCategory,
                }
            );
    }
}
