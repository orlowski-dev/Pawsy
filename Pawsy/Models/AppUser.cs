using Microsoft.AspNetCore.Identity;

namespace Pawsy.Models;

public sealed partial class AppUser : IdentityUser
{
    public required string FullName { get; set; }
}
