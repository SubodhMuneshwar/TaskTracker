import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// 1. Local State: title, description, and priority are kept in local component memory using useState
// 2. Child-to-Parent Communication: onAddTask callback is received as a prop and invoked when the user submits
export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    // Call the parent component function passed down via props
    await onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'Pending',
    });

    // Reset local form state
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setIsSubmitting(false);
  };

  return (
    <section className="card form-card">
      <div className="card-header">
        <h2>Create New Task</h2>
        <p>Demonstrates local useState and Child-to-Parent callback</p>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            placeholder="e.g., Learn React hooks and component communication"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            placeholder="Add context or notes..."
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
  );
}
