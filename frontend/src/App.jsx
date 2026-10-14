import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
} from './store/tasksSlice';
import {
  Layers,
  Cpu,
  Cloud,
  Database,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// Modular Child Components demonstrating component communication
import MetricsBanner from './components/MetricsBanner';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import FilterControls from './components/FilterControls';

export default function App() {
  const dispatch = useDispatch();
  
  // 1. Global Redux State (accessible by any component without prop drilling)
  const { items, status, error, filter } = useSelector((state) => state.tasks);

  // 2. Local State with useState (search query and sort criteria)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // 3. Side Effects with useEffect: fetch API data from .NET backend when App loads
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // 4. Child-to-Parent Event Handlers:
  // These functions are passed down as callback props to children (TaskForm, TaskCard)
  const handleCreateTask = async (taskData) => {
    await dispatch(addTask(taskData));
  };

  const handleStatusChange = (task, newStatus) => {
    dispatch(
      updateTask({
        id: task.id,
        updatedData: { ...task, status: newStatus },
      })
    );
  };

  const handleToggleComplete = (task) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    dispatch(
      updateTask({
        id: task.id,
        updatedData: { ...task, status: nextStatus },
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task from SQL Server?')) {
      dispatch(deleteTask(id));
    }
  };

  // 5. Derived State (computed on the fly during render)
  const filteredTasks = items
    .filter((task) => {
      const matchesFilter =
        filter === 'All' || task.status.toLowerCase() === filter.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const weights = { High: 3, Medium: 2, Low: 1 };
        return (weights[b.priority] || 0) - (weights[a.priority] || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalCount = items.length;
  const completedCount = items.filter((t) => t.status === 'Completed').length;
  const inProgressCount = items.filter((t) => t.status === 'In Progress').length;
  const pendingCount = items.filter((t) => t.status === 'Pending').length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-header">
        <div className="brand-group">
          <div className="logo-badge">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="app-title">TaskTracker</h1>
            <p className="app-subtitle">.NET 10 + SQL Server + React Redux</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="runtime-pill">
            <Cpu size={14} />
            <span>.NET 10 Kestrel</span>
          </div>
          <div className="runtime-pill" style={{ borderColor: '#0ea5e9', color: '#38bdf8', backgroundColor: 'rgba(14, 165, 233, 0.15)' }}>
            <Database size={14} />
            <span>SQL Server</span>
          </div>
          <div className="cloud-pill">
            <Cloud size={14} />
            <span>OpenShift Ready</span>
          </div>
          <button
            onClick={() => dispatch(fetchTasks())}
            className="btn-secondary"
            title="Sync with SQL Server"
          >
            <RefreshCw size={15} className={status === 'loading' ? 'spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Component Pattern: Parent-to-Child Props */}
      <MetricsBanner
        totalCount={totalCount}
        pendingCount={pendingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
      />

      <main className="content-grid">
        {/* Component Pattern: Child-to-Parent Callback (onAddTask) */}
        <TaskForm onAddTask={handleCreateTask} />

        <section className="tasks-section">
          {/* Component Pattern: Controlled Props & Callback Communication */}
          <FilterControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilter={filter}
            onFilterChange={(newTab) => dispatch(setFilter(newTab))}
            totalCount={totalCount}
            items={items}
          />

          {/* Error State */}
          {error && (
            <div className="alert-error">
              <AlertCircle size={20} />
              <div>
                <strong>Connection Error:</strong> {error}
                <p className="error-help">
                  Make sure your .NET 10 backend is running at http://localhost:5000 with SQL Server.
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && items.length === 0 && (
            <div className="loading-state">
              <RefreshCw size={28} className="spin" />
              <p>Fetching tasks from SQL Server database...</p>
            </div>
          )}

          {/* Task List */}
          <div className="tasks-list">
            {filteredTasks.length === 0 && status !== 'loading' && (
              <div className="empty-state">
                <p>No tasks match your search or filter criteria.</p>
              </div>
            )}

            {/* Component Pattern: Rendering list of child components with Props & Callbacks */}
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
