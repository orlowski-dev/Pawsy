using System.ComponentModel.DataAnnotations;

namespace Pawsy.Models;

public sealed class ProductSubcategory
{
    [Key]
    public Guid Id { get; init; }
    public required string Name { get; set; }
    public required ProductCategory ParentCategory { get; set; }
}
