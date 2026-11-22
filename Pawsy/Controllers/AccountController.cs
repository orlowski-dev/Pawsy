using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pawsy.Models;

namespace Pawsy.Controllers;

public sealed partial class AccountController(
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager
) : Controller
{
    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(
        string username,
        string password,
        bool rememberMe = false,
        string? returnUrl = null
    )
    {
        ViewData["ReturnUrl"] = returnUrl;

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            ModelState.AddModelError("", "Wypełnij wszystkie pola.");
            return View();
        }

        var result = await signInManager.PasswordSignInAsync(
            username,
            password,
            rememberMe,
            lockoutOnFailure: true
        );
        if (result.Succeeded)
        {
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                return LocalRedirect(returnUrl);

            return RedirectToAction("Index", "Home");
        }

        ModelState.AddModelError("", "Nieprawidłowy email lub hasło.");
        return View();
    }

    [HttpGet]
    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(
        string fullname,
        string username,
        string email,
        string password
    )
    {
        IReadOnlyList<string> reqFields = [fullname, username, email, password];
        if (reqFields.Any((field) => string.IsNullOrWhiteSpace(field)))
        {
            ModelState.AddModelError("", "Wypełnij wszystkie pola.");
            return View();
        }

        var user = new AppUser
        {
            Email = email,
            FullName = fullname,
            UserName = username,
        };
        var result = await userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError("", error.Description);

            return View();
        }

        // auto login po rejestracji kotna
        await signInManager.SignInAsync(user, isPersistent: false);

        return RedirectToAction("Index", "Home");
    }

    [HttpPost]
    [Authorize]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        return RedirectToAction("Index", "Home");
    }
}
