using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Pawsy.Models;

[Index(nameof(Name), IsUnique = true)]
public sealed class Product
{
    [Key]
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public required ProductCategory Category { get; set; }
    public required ProductSubcategory Subcategory { get; set; }
    public IList<string> Images { get; set; } = [];
    public decimal? SalePrice { get; set; }

    [NotMapped]
    public bool OnSale => SalePrice is not null;
}
