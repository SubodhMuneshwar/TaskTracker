using Microsoft.EntityFrameworkCore;
using TaskTrackerApi.Models;

namespace TaskTrackerApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure primary key and column constraints
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Priority).HasMaxLength(20);
        });

        // Seed initial roadmap data
        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem
            {
                Id = 1,
                Title = "Set up .NET Framework 4.7 Web API",
                Description = "Build backend endpoints with Web API 2 controllers and CORS",
                Status = "Completed",
                Priority = "High",
                CreatedAt = new DateTime(2026, 10, 14, 10, 0, 0, DateTimeKind.Utc)
            },
            new TaskItem
            {
                Id = 2,
                Title = "Build React + Redux Frontend",
                Description = "Connect Redux Toolkit store, async thunks, and UI dashboard",
                Status = "Completed",
                Priority = "High",
                CreatedAt = new DateTime(2026, 10, 14, 11, 0, 0, DateTimeKind.Utc)
            },
            new TaskItem
            {
                Id = 3,
                Title = "Migrate Backend to .NET 10",
                Description = "Modernize project file, Kestrel server, and ASP.NET Core controllers",
                Status = "Completed",
                Priority = "High",
                CreatedAt = new DateTime(2026, 10, 14, 12, 0, 0, DateTimeKind.Utc)
            },
            new TaskItem
            {
                Id = 4,
                Title = "Containerize and Deploy on OpenShift",
                Description = "Create multi-stage Dockerfile, Pods, Services, and OpenShift Routes",
                Status = "Completed",
                Priority = "High",
                CreatedAt = new DateTime(2026, 10, 14, 13, 0, 0, DateTimeKind.Utc)
            },
            new TaskItem
            {
                Id = 5,
                Title = "Integrate Microsoft SQL Server",
                Description = "Replace in-memory store with Entity Framework Core and SQL Server database",
                Status = "Completed",
                Priority = "High",
                CreatedAt = new DateTime(2026, 10, 14, 14, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
