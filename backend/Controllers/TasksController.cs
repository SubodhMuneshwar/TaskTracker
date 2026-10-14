using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;
using TaskTrackerApi.Models;

namespace TaskTrackerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private static readonly ConcurrentDictionary<int, TaskItem> Tasks = new();
    private static int _nextId = 1;
    private static readonly object _lock = new();

    static TasksController()
    {
        SeedInitialTasks();
    }

    private static void SeedInitialTasks()
    {
        var initialList = new List<TaskItem>
        {
            new()
            {
                Id = _nextId++,
                Title = "Set up .NET Framework 4.7 Web API",
                Description = "Build backend endpoints with Web API 2 controllers and CORS",
                Status = "Completed",
                Priority = "High",
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new()
            {
                Id = _nextId++,
                Title = "Build React + Redux Frontend",
                Description = "Connect Redux Toolkit store, async thunks, and UI dashboard",
                Status = "Completed",
                Priority = "High",
                CreatedAt = DateTime.UtcNow.AddHours(-1)
            },
            new()
            {
                Id = _nextId++,
                Title = "Migrate Backend to .NET 10",
                Description = "Modernize project file, Kestrel server, and ASP.NET Core controllers",
                Status = "Completed",
                Priority = "High",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = _nextId++,
                Title = "Containerize and Deploy on OpenShift",
                Description = "Create Containerfile, understand Pods, Services, and OpenShift Routes",
                Status = "Pending",
                Priority = "Medium",
                CreatedAt = DateTime.UtcNow
            }
        };

        foreach (var task in initialList)
        {
            Tasks[task.Id] = task;
        }
    }

    // GET: api/tasks
    [HttpGet]
    public ActionResult<IEnumerable<TaskItem>> GetAll()
    {
        var allTasks = Tasks.Values.OrderBy(t => t.Id).ToList();
        return Ok(allTasks);
    }

    // GET: api/tasks/1
    [HttpGet("{id:int}")]
    public ActionResult<TaskItem> GetById(int id)
    {
        if (Tasks.TryGetValue(id, out var task))
        {
            return Ok(task);
        }
        return NotFound();
    }

    // POST: api/tasks
    [HttpPost]
    public ActionResult<TaskItem> Create([FromBody] TaskItem newTask)
    {
        if (newTask == null || string.IsNullOrWhiteSpace(newTask.Title))
        {
            return BadRequest("Task title is required.");
        }

        lock (_lock)
        {
            newTask.Id = _nextId++;
        }
        newTask.CreatedAt = DateTime.UtcNow;

        Tasks[newTask.Id] = newTask;
        return CreatedAtAction(nameof(GetById), new { id = newTask.Id }, newTask);
    }

    // PUT: api/tasks/1
    [HttpPut("{id:int}")]
    public ActionResult<TaskItem> Update(int id, [FromBody] TaskItem updatedTask)
    {
        if (updatedTask == null || string.IsNullOrWhiteSpace(updatedTask.Title))
        {
            return BadRequest("Task data is invalid.");
        }

        if (!Tasks.ContainsKey(id))
        {
            return NotFound();
        }

        updatedTask.Id = id;
        Tasks[id] = updatedTask;
        return Ok(updatedTask);
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id:int}")]
    public ActionResult<TaskItem> Delete(int id)
    {
        if (Tasks.TryRemove(id, out var removedTask))
        {
            return Ok(removedTask);
        }
        return NotFound();
    }
}
