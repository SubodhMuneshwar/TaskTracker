using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using TaskTrackerApi.Models;

namespace TaskTrackerApi.Controllers
{
    [RoutePrefix("api/tasks")]
    public class TasksController : ApiController
    {
        private static readonly ConcurrentDictionary<int, TaskItem> Tasks = new ConcurrentDictionary<int, TaskItem>();
        private static int _nextId = 1;
        private static readonly object _lock = new object();

        static TasksController()
        {
            SeedInitialTasks();
        }

        private static void SeedInitialTasks()
        {
            var initialList = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = _nextId++,
                    Title = "Set up .NET Framework 4.7 Web API",
                    Description = "Build backend endpoints with Web API 2 controllers and CORS",
                    Status = "Completed",
                    Priority = "High",
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new TaskItem
                {
                    Id = _nextId++,
                    Title = "Build React + Redux Frontend",
                    Description = "Connect Redux Toolkit store, async thunks, and UI dashboard",
                    Status = "In Progress",
                    Priority = "High",
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new TaskItem
                {
                    Id = _nextId++,
                    Title = "Migrate Backend to .NET 10",
                    Description = "Modernize project file, Kestrel server, and minimal APIs/controllers",
                    Status = "Pending",
                    Priority = "Medium",
                    CreatedAt = DateTime.UtcNow
                },
                new TaskItem
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

        // GET api/tasks
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetAll()
        {
            var allTasks = Tasks.Values.OrderBy(t => t.Id).ToList();
            return Ok(allTasks);
        }

        // GET api/tasks/{id}
        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetById(int id)
        {
            if (Tasks.TryGetValue(id, out var task))
            {
                return Ok(task);
            }
            return NotFound();
        }

        // POST api/tasks
        [HttpPost]
        [Route("")]
        public IHttpActionResult Create([FromBody] TaskItem newTask)
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
            return Created($"api/tasks/{newTask.Id}", newTask);
        }

        // PUT api/tasks/{id}
        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult Update(int id, [FromBody] TaskItem updatedTask)
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

        // DELETE api/tasks/{id}
        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            if (Tasks.TryRemove(id, out var removedTask))
            {
                return Ok(removedTask);
            }
            return NotFound();
        }
    }
}
