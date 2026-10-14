using Microsoft.EntityFrameworkCore;
using TaskTrackerApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();

// 2. Configure SQL Server with Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.\\SQLEXPRESS;Database=TaskTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// 3. Configure CORS for frontend access (React running on localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Configure Kestrel web server to listen on port 5000
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

var app = builder.Build();

// 5. Automatically create database and seed data if not already created
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

// 6. Configure HTTP request pipeline
app.UseCors();
app.MapControllers();

Console.WriteLine("====================================================");
Console.WriteLine("  TaskTracker API (.NET 10 + Microsoft SQL Server)");
Console.WriteLine("====================================================");
Console.WriteLine("Database: Microsoft SQL Server (TaskTrackerDb)");
Console.WriteLine("Server is running on: http://localhost:5000");
Console.WriteLine("Test endpoint: http://localhost:5000/api/tasks");

app.Run();
