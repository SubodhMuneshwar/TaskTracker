import React from 'react';

// Parent to Child Communication:
// MetricsBanner receives `totalCount`, `pendingCount`, `inProgressCount`, and `completedCount` as PROPS from App.jsx
export default function MetricsBanner({ totalCount, pendingCount, inProgressCount, completedCount }) {
  return (
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
  );
}
