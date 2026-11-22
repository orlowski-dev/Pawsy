using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Pawsy.Models;

[Index(nameof(Name), IsUnique = true)]
public sealed class ProductCategory
{
    [Key]
    public Guid Id { get; init; }
    public string Name { get; set; } = string.Empty;
}
