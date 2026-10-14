# TaskTracker: Enterprise Modernization, SQL Server & Cloud Architecture

A hands-on, enterprise-grade full-stack project demonstrating the complete lifecycle of modernizing a legacy .NET backend, integrating a real Microsoft SQL Server database with Entity Framework Core, connecting a modern React Redux frontend, and preparing for cloud-native deployment on Red Hat OpenShift.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/SubodhMuneshwar/TaskTracker)
[![.NET Version](https://img.shields.io/badge/.NET-10.0-purple?logo=dotnet)](https://dotnet.microsoft.com/)
[![Database](https://img.shields.io/badge/Database-Microsoft_SQL_Server-red?logo=microsoftsqlserver)](https://www.microsoft.com/en-us/sql-server/)
[![ORM](https://img.shields.io/badge/ORM-Entity_Framework_Core_10-512bd4?logo=dotnet)](https://learn.microsoft.com/en-us/ef/core/)
[![React Version](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764abc?logo=redux)](https://redux-toolkit.js.org/)
[![Target Platform](https://img.shields.io/badge/Cloud-Red_Hat_OpenShift_Ready-red?logo=redhatopenshift)](https://www.redhat.com/en/technologies/cloud-computing/openshift)

---

## 1. Executive Summary & Purpose

In large-scale enterprise environments, engineering teams frequently modernize existing on-premise Windows applications into resilient, cloud-native services.

This repository documents the complete end-to-end modernization lifecycle of **TaskTracker**:
1. **Initial State (Legacy)**: A RESTful API built on **.NET Framework 4.7.2** using OWIN self-hosting and ASP.NET Web API 2.
2. **Frontend Layer**: A responsive Single Page Application built with **React 18**, **Vite**, and **Redux Toolkit** for central state management and asynchronous data flow.
3. **Modernization Phase**: Architectural migration to cross-platform **.NET 10**, transitioning to the high-throughput **Kestrel** web server, modern `Program.cs` minimal hosting, and ASP.NET Core controllers.
4. **Database Persistence**: Integration of **Microsoft SQL Server** with **Entity Framework Core 10 (EF Core)**, replacing in-memory state with a persistent relational database and automated schema creation.
5. **Cloud-Native Target**: Containerization using a multi-stage **Dockerfile** and declarative manifests (**Deployment**, **Service**, **Route**) for **Red Hat OpenShift**.

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
|   - Native CORS & Scoped Dependency Injection               |
+------------------------------+------------------------------+
                               |
                   Entity Framework Core 10
                               |
                               v
+-------------------------------------------------------------+
|                 Relational Database Storage                 |
|               Microsoft SQL Server (SQLEXPRESS)             |
|                   Database: TaskTrackerDb                   |
|                   Table: Tasks (Schema)                     |
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
- **Web Server**: Kestrel (originally OWIN Katana HttpListener)
- **API Framework**: ASP.NET Core Controllers (`Microsoft.AspNetCore.Mvc`)
- **Database**: Microsoft SQL Server (SQLEXPRESS)
- **ORM**: Entity Framework Core 10 (`Microsoft.EntityFrameworkCore.SqlServer`)
- **JSON Serialization**: System.Text.Json (camelCase formatting)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Async Handling**: `createAsyncThunk` with lifecycle reducers (`pending`, `fulfilled`, `rejected`)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 design system with dark-slate theme, status badges, and responsive layout

### Cloud & DevOps
- **Containerization**: Multi-stage Dockerfile (build stage: .NET 10 SDK, runtime: ASP.NET 10)
- **Orchestration**: Red Hat OpenShift / Kubernetes manifests (Deployment, Service, Route)

---

## 4. Database Schema (Microsoft SQL Server)

The database `TaskTrackerDb` is automatically initialized on application startup using `dbContext.Database.EnsureCreated()`.

### `Tasks` Table Definition
| Column | Data Type | Nullable | Description |
|---|---|---|---|
| `Id` | `INT` (Identity) | No (PK) | Auto-incrementing primary key |
| `Title` | `NVARCHAR(200)` | No | Task title |
| `Description` | `NVARCHAR(1000)`| Yes | Detailed notes or context |
| `Status` | `NVARCHAR(50)` | No | Status (`Pending`, `In Progress`, `Completed`) |
| `Priority` | `NVARCHAR(20)` | No | Priority (`Low`, `Medium`, `High`) |
| `CreatedAt` | `DATETIME2` | No | Timestamp in UTC |

---

## 5. API Specification

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/tasks` | Retrieves all tasks from SQL Server | `200 OK` |
| `GET` | `/api/tasks/{id}` | Retrieves a single task by ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/tasks` | Creates a new task and commits to SQL Server | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/tasks/{id}` | Updates an existing task in SQL Server | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/tasks/{id}` | Deletes a task from SQL Server | `200 OK`, `404 Not Found` |

### Sample Payload (`TaskItem` Model)
```json
{
  "id": 1,
  "title": "Migrate Backend to .NET 10",
  "description": "Modernize project file, Kestrel server, and ASP.NET Core controllers",
  "status": "Completed",
  "priority": "High",
  "createdAt": "2026-10-14T12:00:00Z"
}
```

---

## 6. Architectural Evolution: .NET 4.7.2 vs .NET 10

| Dimension | Legacy (.NET Framework 4.7.2) | Modernized (.NET 10) |
|---|---|---|
| **OS Compatibility** | Windows-only | Cross-platform (Linux, Windows, macOS) |
| **Web Server** | OWIN / Katana / IIS | Kestrel (Built-in, high throughput) |
| **Data Storage** | Temporary in-memory collections | Microsoft SQL Server with EF Core 10 |
| **Project File SDK** | `Microsoft.NET.Sdk` with manual packages | `Microsoft.NET.Sdk.Web` |
| **Base Controller** | `ApiController` (`System.Web.Http`) | `ControllerBase` (`Microsoft.AspNetCore.Mvc`) |
| **Model Validation** | Manual validation logic | Automatic via `[ApiController]` |
| **Dependency Injection** | Manual or third-party container | Built-in native constructor injection |
| **Startup File** | Split across `Program.cs` and `Startup.cs` | Unified top-level statements in `Program.cs` |
| **Cloud Readiness** | Incompatible with Linux containers | Native Linux container support for OpenShift |

---

## 7. Frontend Architecture (Redux Toolkit)

The React client communicates with the .NET 10 API using Redux Toolkit:

- **Central Store (`src/store/index.js`)**: Holds global application state (`items`, `status`, `error`, `filter`).
- **Async Thunks (`src/store/tasksSlice.js`)**:
  - `fetchTasks`: Dispatches async `GET` request on mount.
  - `addTask`: Dispatches `POST` request and persists to SQL Server.
  - `updateTask`: Dispatches `PUT` request and updates the matched record in state.
  - `deleteTask`: Dispatches `DELETE` request and removes the record from state.
- **Dashboard Features (`src/App.jsx`)**:
  - Live metrics banner (Total, Pending, In Progress, Completed).
  - Real-time search by title or description keywords.
  - Sorting dropdown (Newest First vs Highest Priority).
  - One-click completion toggle.
  - Responsive creation form with validation.

---

## 8. OpenShift Deployment & Containerization

With .NET 10 running cross-platform, the backend is containerized for Red Hat OpenShift:

1. **Multi-Stage Dockerfile (`backend/Dockerfile`)**:
   - Stage 1: Builds and publishes the project using `mcr.microsoft.com/dotnet/sdk:10.0`.
   - Stage 2: Copies binaries into minimal `mcr.microsoft.com/dotnet/aspnet:10.0` runtime image (under 200MB).
2. **OpenShift Manifest (`openshift/deployment.yaml`)**:
   - **Deployment**: Maintains 2 replicas of the backend with CPU and memory limits.
   - **Service**: Internal cluster load balancer on port 5000 (`tasktracker-service`).
   - **Route**: Exposes public external HTTPS address with edge TLS termination.

---

## 9. Local Setup & Verification

### Prerequisites
- .NET 10 SDK (`dotnet --version`)
- Microsoft SQL Server (`.\SQLEXPRESS` or LocalDB)
- Node.js v18+ and npm (`npm.cmd --version`)

### 1. Run the Backend (with SQL Server)
```powershell
cd backend
dotnet run
```
- Automatically initializes `TaskTrackerDb` on `.\SQLEXPRESS` and seeds records.
- Verified endpoint: `http://localhost:5000/api/tasks`

### 2. Verify SQL Server via CLI
```powershell
sqlcmd -S ".\SQLEXPRESS" -E -d "TaskTrackerDb" -Q "SELECT Id, Title, Status, Priority FROM Tasks;"
```

### 3. Run the React Frontend
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
- Open `http://localhost:5173/` in your browser.

---

## Author & Project Metadata
- **Author**: Subodh Muneshwar
- **Repository**: [https://github.com/SubodhMuneshwar/TaskTracker.git](https://github.com/SubodhMuneshwar/TaskTracker.git)
