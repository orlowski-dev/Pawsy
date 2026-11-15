using Microsoft.AspNetCore.Mvc;

namespace Pawsy.Controllers;

public sealed partial class AccountController : Controller
{
    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }
}
