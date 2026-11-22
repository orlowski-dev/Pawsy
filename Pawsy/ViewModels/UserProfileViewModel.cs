namespace Pawsy.ViewModels;

public sealed record UserProfileViewModel(
    string Id,
    string FullName,
    string Username,
    string Email
);
