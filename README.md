# TaskTracker: Enterprise Modernization & Full-Stack Architecture

A hands-on, enterprise-grade full-stack project demonstrating the real-world modernization of a legacy .NET backend and integration with a modern React state-managed frontend, built for cloud-native deployment on Red Hat OpenShift.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/SubodhMuneshwar/TaskTracker)
[![.NET Version](https://img.shields.io/badge/.NET-10.0-purple?logo=dotnet)](https://dotnet.microsoft.com/)
[![React Version](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764abc?logo=redux)](https://redux-toolkit.js.org/)
[![Target Platform](https://img.shields.io/badge/Cloud-Red_Hat_OpenShift_Ready-red?logo=redhatopenshift)](https://www.redhat.com/en/technologies/cloud-computing/openshift)

---

## 1. Executive Summary & Purpose

In large-scale enterprise environments, engineering teams frequently encounter legacy web services built on classic Windows-bound frameworks. Migrating these systems to modern, container-ready runtimes while preserving seamless integration with modern single-page applications (SPAs) is a critical core competency.

This repository documents the complete end-to-end modernization lifecycle of **TaskTracker**:
1. **Initial State**: A classic RESTful API built on **.NET Framework 4.7.2** utilizing OWIN self-hosting and ASP.NET Web API 2.
2. **Frontend Layer**: A responsive SPA built with **React 18**, **Vite**, and **Redux Toolkit** for centralized state management and asynchronous data flow.
3. **Modernization Phase**: An architectural migration to **.NET 10**, transitioning to the high-performance, cross-platform **Kestrel** web server, modern `Program.cs` minimal hosting, and ASP.NET Core controllers.
4. **Cloud-Native Target**: Preparation and architecture alignment for containerization and deployment onto **Red Hat OpenShift**.

---

## 2. System Architecture

```
+-------------------------------------------------------------+
|                     Client Browser                          |
|             React 18 + Redux Toolkit Dashboard              |
|                   (http://localhost:5173)                   |
+------------------------------+------------------------------+
                               |
                   HTTP REST Requests (CORS)
                               |
                               v
+-------------------------------------------------------------+
|                     Backend API Server                      |
|                 (http://localhost:5000/api/tasks)            |
|                                                             |
|   Phase 1 (Legacy):                                         |
|   - .NET Framework 4.7.2 (net472)                           |
|   - OWIN / Katana Self-Hosted HttpListener                  |
|   - ApiController (System.Web.Http)                         |
|                                                             |
|   Phase 2 (Modernized):                                     |
|   - .NET 10.0 (net10.0)                                     |
|   - Kestrel Cross-Platform High-Throughput Server           |
|   - ControllerBase & [ApiController] (ASP.NET Core)         |
|   - Native CORS & In-Memory Thread-Safe Concurrent Store    |
+-------------------------------------------------------------+
                               |
                  Containerization Target
                               v
+-------------------------------------------------------------+
|                     Red Hat OpenShift                       |
|           Linux Container (Pod, Service, Route)             |
+-------------------------------------------------------------+
```

---

## 3. Technology Stack

### Backend
- **Framework**: .NET 10 (originally .NET Framework 4.7.2)
- **Web Server**: Kestrel (originally OWIN / Microsoft.Owin.Hosting)
- **API Framework**: ASP.NET Core Controllers (`Microsoft.AspNetCore.Mvc`)
- **JSON Serialization**: System.Text.Json (camelCase formatting)
- **Concurrency**: `System.Collections.Concurrent.ConcurrentDictionary` for thread-safe state

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Async Handling**: `createAsyncThunk` with lifecycle reducers (`pending`, `fulfilled`, `rejected`)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 design system with custom properties, responsive grid, and dark slate theme

---

## 4. API Specification

All endpoints are hosted at base URL `http://localhost:5000/api/tasks`.

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/tasks` | Retrieves all tasks | `200 OK` |
| `GET` | `/api/tasks/{id}` | Retrieves a single task by ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/tasks` | Creates a new task | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/tasks/{id}` | Updates an existing task | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/tasks/{id}` | Deletes a task by ID | `200 OK`, `404 Not Found` |

### Sample Payload (`TaskItem` Model)
```json
{
  "id": 1,
  "title": "Migrate Backend to .NET 10",
  "description": "Modernize project file, Kestrel server, and ASP.NET Core controllers",
  "status": "Completed",
  "priority": "High",
  "createdAt": "2026-10-14T15:00:00Z"
}
```

---

## 5. Architectural Deep-Dive: .NET 4.7.2 vs .NET 10

| Architectural Dimension | Legacy (.NET Framework 4.7.2) | Modernized (.NET 10) |
|---|---|---|
| **OS Compatibility** | Windows-only | Cross-platform (Linux, macOS, Windows) |
| **Web Server** | OWIN / Katana / IIS | Kestrel (Built-in, high throughput) |
| **Project File SDK** | `Microsoft.NET.Sdk` with manual assembly imports | `Microsoft.NET.Sdk.Web` (Zero external packages needed) |
| **Base Controller** | `ApiController` (`System.Web.Http`) | `ControllerBase` (`Microsoft.AspNetCore.Mvc`) |
| **Model Validation** | Manual validation checks | Automatic via `[ApiController]` |
| **Startup File** | Split across `Program.cs` and `Startup.cs` | Unified top-level statements in `Program.cs` |
| **CORS Configuration** | `Microsoft.Owin.Cors` middleware | Native `builder.Services.AddCors()` |
| **Cloud / OpenShift** | Incompatible with standard Linux containers | Native Linux container support |

---

## 6. Frontend State Architecture (Redux Toolkit)

The React client utilizes a predictable unidirectional data flow powered by Redux Toolkit:

- **Centralized Store (`src/store/index.js`)**: Holds the entire global application state (`items`, `status`, `error`, `filter`).
- **Async Thunks (`src/store/tasksSlice.js`)**:
  - `fetchTasks`: Dispatches asynchronous `GET` request on initial mount.
  - `addTask`: Dispatches `POST` request and appends newly created item to state.
  - `updateTask`: Dispatches `PUT` request and updates the matched task in state.
  - `deleteTask`: Dispatches `DELETE` request and filters out the deleted ID.
- **UI Components (`src/App.jsx`)**:
  - Metric summary cards (Total, Pending, In Progress, Completed).
  - Real-time search filter and priority/date sorter.
  - One-click task completion toggle.
  - Responsive creation form with validation.

---

## 7. Local Development & Verification

### Prerequisites
- .NET 10 SDK (`dotnet --version`)
- Node.js v18+ and npm (`npm.cmd --version`)

### 1. Run the Backend API
```powershell
cd backend
dotnet run
```
- Endpoint verified: `http://localhost:5000/api/tasks`

### 2. Run the React Frontend
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
- Dashboard URL: `http://localhost:5173/`

### 3. Verification with Postman
You can import and execute the following requests in Postman against `http://localhost:5000`:
1. `GET /api/tasks` -> Returns HTTP 200 with list of seeded tasks.
2. `POST /api/tasks` -> Headers: `Content-Type: application/json`, Body: `{ "title": "New Task", "priority": "High" }`. Returns HTTP 201.
3. `PUT /api/tasks/1` -> Updates status to "Completed". Returns HTTP 200.
4. `DELETE /api/tasks/1` -> Removes task. Returns HTTP 200.

---

## 8. Next Phase: OpenShift & Containerization

With the backend successfully upgraded to cross-platform .NET 10, the project is ready for containerization:
1. Multi-stage Dockerfile / Containerfile build (Build image vs runtime distroless image).
2. Kubernetes / OpenShift manifests:
   - **Pod / Deployment**: Manages the running container replicas.
   - **Service**: Provides internal cluster IP and port abstraction.
   - **Route**: Exposes the service to external internet traffic via OpenShift Router.

---

## Author & Project Metadata
- **Author**: Subodh Muneshwar
- **Repository**: [https://github.com/SubodhMuneshwar/TaskTracker.git](https://github.com/SubodhMuneshwar/TaskTracker.git)
