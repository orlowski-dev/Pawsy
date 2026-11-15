using Microsoft.AspNetCore.Identity;

namespace Pawsy.Models;

public sealed partial class AppUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}
