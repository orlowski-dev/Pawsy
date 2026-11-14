using Microsoft.EntityFrameworkCore;
using Pawsy.Models;

namespace Pawsy.Data;

public static class DbSeeder
{
    public static void Seed(DbContext dbContext, bool _)
    {
        if (!dbContext.Set<ProductCategory>().Any())
            SeedProductCategory(dbContext);

        dbContext.SaveChanges();

        if (!dbContext.Set<ProductSubcategory>().Any())
            SeedProductSubcategory(dbContext);

        dbContext.SaveChanges();

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

        await dbContext.SaveChangesAsync(cancellationToken);

        if (!await dbContext.Set<ProductSubcategory>().AnyAsync(cancellationToken))
            SeedProductSubcategory(dbContext);

        await dbContext.SaveChangesAsync(cancellationToken);

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
        var cat = dbContext.Set<ProductCategory>().First((i) => i.Name == "kot");

        dbContext
            .Set<Product>()
            .AddRange(
                new Product
                {
                    Name = "Royal Canin Medium Adult",
                    Price = 39.99M,
                    Category = cat,
                    Subcategory = dbContext
                        .Set<ProductSubcategory>()
                        .First((sb) => sb.Name == "Karmy"),
                }
            );
    }

    private static void SeedProductSubcategory(DbContext dbContext)
    {
        var catCategory = dbContext.Set<ProductCategory>().First((i) => i.Name == "kot");
        dbContext
            .Set<ProductSubcategory>()
            .AddRange(
                new ProductSubcategory { Name = "Drapaki", ParentCategory = catCategory },
                new ProductSubcategory { Name = "Szelki", ParentCategory = catCategory },
                new ProductSubcategory { Name = "Zabawki", ParentCategory = catCategory },
                new ProductSubcategory { Name = "Legowiska", ParentCategory = catCategory },
                new ProductSubcategory { Name = "Karmy", ParentCategory = catCategory }
            );
    }
}
