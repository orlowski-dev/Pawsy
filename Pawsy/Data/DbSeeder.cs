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

    private static void SeedProductSubcategory(DbContext dbContext)
    {
        var categories = dbContext.Set<ProductCategory>().ToDictionary(c => c.Name);

        var subcategories = new (string Category, string Name)[]
        {
            // Psy
            ("pies", "Karmy dla psów"),
            ("pies", "Przysmaki dla psów"),
            ("pies", "Zabawki dla psów"),
            ("pies", "Smycze i obroże"),
            ("pies", "Legowiska dla psów"),
            // Koty
            ("kot", "Karmy dla kotów"),
            ("kot", "Drapaki"),
            ("kot", "Zabawki dla kotów"),
            ("kot", "Legowiska dla kotów"),
            ("kot", "Żwirki"),
            // Rybki
            ("rybki", "Pokarmy dla ryb"),
            ("rybki", "Akwaria"),
            ("rybki", "Filtry akwariowe"),
            ("rybki", "Dekoracje akwariowe"),
            ("rybki", "Akcesoria akwariowe"),
            // Ptaki
            ("ptaki", "Pokarmy dla ptaków"),
            ("ptaki", "Klatki"),
            ("ptaki", "Zabawki dla ptaków"),
            ("ptaki", "Żerdzie"),
            ("ptaki", "Akcesoria dla ptaków"),
        };

        dbContext
            .Set<ProductSubcategory>()
            .AddRange(
                subcategories.Select(s => new ProductSubcategory
                {
                    Name = s.Name,
                    ParentCategory = categories[s.Category],
                })
            );
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
        var categories = dbContext.Set<ProductCategory>().ToDictionary(c => c.Name);

        var subcategories = dbContext.Set<ProductSubcategory>().ToDictionary(s => s.Name);

        var products = new (string Category, string Subcategory, string Name, decimal Price)[]
        {
            // PSY — Karmy
            ("pies", "Karmy dla psów", "Royal Canin Medium Adult 4 kg", 139.99M),
            ("pies", "Karmy dla psów", "Brit Premium Adult Chicken 3 kg", 49.99M),
            // PSY — Przysmaki
            ("pies", "Przysmaki dla psów", "Pedigree Rodeo 123 g", 11.99M),
            ("pies", "Przysmaki dla psów", "Trixie Premio Chicken Bites 100 g", 14.99M),
            // PSY — Zabawki
            ("pies", "Zabawki dla psów", "KONG Classic M", 49.99M),
            ("pies", "Zabawki dla psów", "Trixie Piłka gumowa 7 cm", 12.99M),
            // PSY — Smycze i obroże
            ("pies", "Smycze i obroże", "Flexi New Classic M 5 m", 69.99M),
            ("pies", "Smycze i obroże", "Trixie Obroża nylonowa M", 19.99M),
            // PSY — Legowiska
            ("pies", "Legowiska dla psów", "Trixie Legowisko Jimmy 65 cm", 119.99M),
            ("pies", "Legowiska dla psów", "Legowisko ortopedyczne 80x60 cm", 189.99M),
            // KOTY — Karmy
            ("kot", "Karmy dla kotów", "Royal Canin Indoor 27 2 kg", 99.99M),
            ("kot", "Karmy dla kotów", "Purina One Indoor 1.5 kg", 44.99M),
            // KOTY — Drapaki
            ("kot", "Drapaki", "Trixie Drapak Baza 50 cm", 79.99M),
            ("kot", "Drapaki", "Drapak wielopoziomowy 120 cm", 249.99M),
            // KOTY — Zabawki
            ("kot", "Zabawki dla kotów", "Trixie Wędka z piórkami", 12.99M),
            ("kot", "Zabawki dla kotów", "Piłeczki z dzwoneczkiem 4 szt.", 15.99M),
            // KOTY — Legowiska
            ("kot", "Legowiska dla kotów", "Trixie Hamak na kaloryfer", 69.99M),
            ("kot", "Legowiska dla kotów", "Budka dla kota 40x40 cm", 89.99M),
            // KOTY — Żwirki
            ("kot", "Żwirki", "Cats Best Original 10 l", 59.99M),
            ("kot", "Żwirki", "Benek Super Compact 10 l", 34.99M),
            // RYBKI — Pokarmy
            ("rybki", "Pokarmy dla ryb", "TetraMin Flakes 250 ml", 22.99M),
            ("rybki", "Pokarmy dla ryb", "Tropical Bio-Vit 100 ml", 12.99M),
            // RYBKI — Akwaria
            ("rybki", "Akwaria", "Akwarium prostokątne 54 l", 189.99M),
            ("rybki", "Akwaria", "Zestaw akwariowy 112 l", 499.99M),
            // RYBKI — Filtry
            ("rybki", "Filtry akwariowe", "Aquael Fan Mini Plus", 59.99M),
            ("rybki", "Filtry akwariowe", "Eheim Pickup 200", 129.99M),
            // RYBKI — Dekoracje
            ("rybki", "Dekoracje akwariowe", "Korzeń dekoracyjny do akwarium", 39.99M),
            ("rybki", "Dekoracje akwariowe", "Grota ceramiczna dla ryb", 24.99M),
            // RYBKI — Akcesoria
            ("rybki", "Akcesoria akwariowe", "Aquael Grzałka Ultra Heater 100 W", 99.99M),
            ("rybki", "Akcesoria akwariowe", "Termometr akwariowy szklany", 9.99M),
            // PTAKI — Pokarmy
            ("ptaki", "Pokarmy dla ptaków", "Vitapol Karma dla papużek 1 kg", 14.99M),
            ("ptaki", "Pokarmy dla ptaków", "Versele-Laga Prestige 1 kg", 19.99M),
            // PTAKI — Klatki
            ("ptaki", "Klatki", "Klatka dla papużek 60x40 cm", 189.99M),
            ("ptaki", "Klatki", "Klatka dla kanarków 45x30 cm", 129.99M),
            // PTAKI — Zabawki
            ("ptaki", "Zabawki dla ptaków", "Huśtawka drewniana dla papug", 24.99M),
            ("ptaki", "Zabawki dla ptaków", "Drabinka z dzwoneczkiem", 19.99M),
            // PTAKI — Żerdzie
            ("ptaki", "Żerdzie", "Żerdź naturalna 30 cm", 14.99M),
            ("ptaki", "Żerdzie", "Żerdź mineralna 20 cm", 17.99M),
            // PTAKI — Akcesoria
            ("ptaki", "Akcesoria dla ptaków", "Poidełko automatyczne 100 ml", 9.99M),
            ("ptaki", "Akcesoria dla ptaków", "Basen kąpielowy dla papużek", 19.99M),
        };

        dbContext
            .Set<Product>()
            .AddRange(
                products.Select(p => new Product
                {
                    Name = p.Name,
                    Price = p.Price,
                    Category = categories[p.Category],
                    Subcategory = subcategories[p.Subcategory],
                })
            );
    }
}
