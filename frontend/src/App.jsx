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
} from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const { items, status, error, filter } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  // Filtered tasks based on active tab
  const filteredTasks = items.filter((task) => {
    if (filter === 'All') return true;
    return task.status.toLowerCase() === filter.toLowerCase();
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
            <p className="app-subtitle">.NET 4.7 Web API + React Redux</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="backend-pill">
            <Server size={14} />
            <span>API: localhost:5000</span>
          </div>
          <button
            onClick={() => dispatch(fetchTasks())}
            className="btn-secondary"
            title="Refresh tasks"
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
            <p>Dispatches addTask action to the Redux store</p>
          </div>

          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                placeholder="e.g., Learn OpenShift basics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Add any notes or context..."
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

        {/* Right Column: Filter Bar & Task Cards */}
        <section className="tasks-section">
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
                  Make sure your backend API is running at http://localhost:5000.
                </p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {status === 'loading' && items.length === 0 && (
            <div className="loading-state">
              <RefreshCw size={28} className="spin" />
              <p>Fetching tasks from .NET 4.7 Web API...</p>
            </div>
          )}

          {/* Task List */}
          <div className="tasks-list">
            {filteredTasks.length === 0 && status !== 'loading' && (
              <div className="empty-state">
                <p>No tasks found in '{filter}'.</p>
              </div>
            )}

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}
              >
                <div className="task-card-header">
                  <div className="task-title-group">
                    <h3 className="task-title">{task.title}</h3>
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
