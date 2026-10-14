using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTrackerApi.Data;
using TaskTrackerApi.Models;

namespace TaskTrackerApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
    {
        var allTasks = await _context.Tasks
            .OrderBy(t => t.Id)
            .ToListAsync();
        return Ok(allTasks);
    }

    // GET: api/tasks/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create([FromBody] TaskItem newTask)
    {
        if (newTask == null || string.IsNullOrWhiteSpace(newTask.Title))
        {
            return BadRequest("Task title is required.");
        }

        newTask.CreatedAt = DateTime.UtcNow;
        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = newTask.Id }, newTask);
    }

    // PUT: api/tasks/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskItem>> Update(int id, [FromBody] TaskItem updatedTask)
    {
        if (updatedTask == null || string.IsNullOrWhiteSpace(updatedTask.Title))
        {
            return BadRequest("Task data is invalid.");
        }

        var existing = await _context.Tasks.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Title = updatedTask.Title;
        existing.Description = updatedTask.Description;
        existing.Status = updatedTask.Status;
        existing.Priority = updatedTask.Priority;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<TaskItem>> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(task);
    }
}
