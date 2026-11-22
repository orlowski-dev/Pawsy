using Microsoft.AspNetCore.Mvc;

namespace Pawsy.Controllers;

public class CartController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
