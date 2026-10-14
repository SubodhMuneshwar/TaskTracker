var builder = WebApplication.CreateBuilder(args);

// 1. Add Controller support
builder.Services.AddControllers();

// 2. Configure CORS for frontend access (React running on localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. Configure Kestrel web server to listen on port 5000
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000);
});

var app = builder.Build();

// 4. Configure HTTP request pipeline
app.UseCors();
app.MapControllers();

Console.WriteLine("====================================================");
Console.WriteLine("  TaskTracker API (.NET 10 - Modernized)");
Console.WriteLine("====================================================");
Console.WriteLine("Server is running on: http://localhost:5000");
Console.WriteLine("Test endpoint: http://localhost:5000/api/tasks");

app.Run();
