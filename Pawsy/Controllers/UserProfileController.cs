using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Pawsy.Models;
using Pawsy.ViewModels;

namespace Pawsy.Controllers;

[Authorize]
public sealed partial class UserProfileController(UserManager<AppUser> userManager) : Controller
{
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var user = await userManager.GetUserAsync(User);
        if (user == null)
        {
            return Challenge();
        }

        var profileVM = new UserProfileViewModel(
            Id: user.Id,
            FullName: user.FullName,
            Username: user.UserName!,
            Email: user.Email!
        );

        return View(profileVM);
    }
}
