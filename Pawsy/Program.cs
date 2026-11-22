using Microsoft.EntityFrameworkCore;
using Pawsy.Data;
using Pawsy.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options
        .UseSqlite(connectionString)
        .UseSeeding(DbSeeder.Seed)
        .UseAsyncSeeding(DbSeeder.SeedAsync)
);
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder
    .Services.AddDefaultIdentity<AppUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Auth/Login";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
        name: "product",
        pattern: "Product/{action=Index}",
        new { controller = "Product" }
    )
    .WithStaticAssets();

app.MapControllerRoute(
        name: "authLogin",
        pattern: "Auth/{action=Login}",
        defaults: new { controller = "Account" }
    )
    .WithStaticAssets();

app.MapControllerRoute(
        name: "userProfile",
        pattern: "UserProfile/{action=Index}",
        defaults: new { controller = "UserProfile" }
    )
    .WithStaticAssets()
    .RequireAuthorization();

app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapRazorPages().WithStaticAssets();

app.Run();
