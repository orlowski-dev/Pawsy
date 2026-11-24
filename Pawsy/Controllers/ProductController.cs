using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pawsy.Data;

namespace Pawsy.Controllers;

public class ProductController : Controller
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var products = await _context
            .Products!.Include(p => p.Category)
            .Include(p => p.Subcategory)
            .AsNoTracking()
            .ToListAsync();

        return View(model: products);
    }
}
