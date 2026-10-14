import React from 'react';
import { Trash2, Check } from 'lucide-react';

// Parent-to-Child: receives `task` data object via props
// Child-to-Parent: calls `onToggleComplete`, `onStatusChange`, and `onDelete` callbacks passed down from the parent
export default function TaskCard({ task, onToggleComplete, onStatusChange, onDelete }) {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}>
      <div className="task-card-header">
        <div className="task-title-group">
          {/* Child-to-Parent trigger */}
          <button
            onClick={() => onToggleComplete(task)}
            className={`btn-toggle-check ${isCompleted ? 'checked' : ''}`}
            title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
          >
            <Check size={14} />
          </button>

          <h3 className={`task-title ${isCompleted ? 'completed-text' : ''}`}>
            {task.title}
          </h3>

          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        {/* Child-to-Parent trigger */}
        <button
          onClick={() => onDelete(task.id)}
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
            onChange={(e) => onStatusChange(task, e.target.value)}
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
  );
}
