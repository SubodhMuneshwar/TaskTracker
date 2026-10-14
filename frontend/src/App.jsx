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
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Server,
  Layers,
  Search,
  Check,
  Cpu,
  Cloud,
} from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const { items, status, error, filter } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await dispatch(
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'Pending',
      })
    );
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setIsSubmitting(false);
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  // Filter & Search Logic
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

  // Metrics
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
            <p className="app-subtitle">.NET 10 Web API + React Redux</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="runtime-pill">
            <Cpu size={14} />
            <span>.NET 10 Kestrel</span>
          </div>
          <div className="cloud-pill">
            <Cloud size={14} />
            <span>OpenShift Ready</span>
          </div>
          <button
            onClick={() => dispatch(fetchTasks())}
            className="btn-secondary"
            title="Sync with backend"
          >
            <RefreshCw size={15} className={status === 'loading' ? 'spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </header>

      {/* Metrics Banner */}
      <section className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Tasks</span>
          <span className="metric-value">{totalCount}</span>
        </div>
        <div className="metric-card pending">
          <span className="metric-label">Pending</span>
          <span className="metric-value">{pendingCount}</span>
        </div>
        <div className="metric-card in-progress">
          <span className="metric-label">In Progress</span>
          <span className="metric-value">{inProgressCount}</span>
        </div>
        <div className="metric-card completed">
          <span className="metric-label">Completed</span>
          <span className="metric-value">{completedCount}</span>
        </div>
      </section>

      {/* Main Layout: New Task Form + Tasks List */}
      <main className="content-grid">
        {/* Left Column: Create Task Form */}
        <section className="card form-card">
          <div className="card-header">
            <h2>Create New Task</h2>
            <p>Dispatches addTask async thunk to Redux store</p>
          </div>

          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="e.g., Deploy to OpenShift cluster"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Add context, notes, or acceptance criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !title.trim()}
            >
              <Plus size={18} />
              <span>{isSubmitting ? 'Creating...' : 'Add Task to Store'}</span>
            </button>
          </form>
        </section>

        {/* Right Column: Controls, Filters & Task Cards */}
        <section className="tasks-section">
          {/* Search & Sort Controls Bar */}
          <div className="controls-bar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sort-box">
              <label>Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="priority">Highest Priority</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="filter-bar">
            {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
              <button
                key={tab}
                className={`filter-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => dispatch(setFilter(tab))}
              >
                {tab}
                <span className="count-badge">
                  {tab === 'All'
                    ? totalCount
                    : items.filter((t) => t.status.toLowerCase() === tab.toLowerCase()).length}
                </span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert-error">
              <AlertCircle size={20} />
              <div>
                <strong>Connection Error:</strong> {error}
                <p className="error-help">
                  Make sure your .NET 10 backend is running at http://localhost:5000.
                </p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {status === 'loading' && items.length === 0 && (
            <div className="loading-state">
              <RefreshCw size={28} className="spin" />
              <p>Fetching tasks from .NET 10 Web API...</p>
            </div>
          )}

          {/* Tasks List */}
          <div className="tasks-list">
            {filteredTasks.length === 0 && status !== 'loading' && (
              <div className="empty-state">
                <p>No tasks match your search or filter criteria.</p>
              </div>
            )}

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}
              >
                <div className="task-card-header">
                  <div className="task-title-group">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`btn-toggle-check ${task.status === 'Completed' ? 'checked' : ''}`}
                      title={task.status === 'Completed' ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <Check size={14} />
                    </button>
                    <h3 className={`task-title ${task.status === 'Completed' ? 'completed-text' : ''}`}>
                      {task.title}
                    </h3>
                    <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn-delete"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}

                <div className="task-card-footer">
                  <div className="status-selector">
                    <label>Status:</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
