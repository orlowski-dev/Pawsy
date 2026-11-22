using Microsoft.AspNetCore.Mvc;

namespace Pawsy.Controllers;

public class FavoritesController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
