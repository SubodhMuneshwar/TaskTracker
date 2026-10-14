import React from 'react';
import { Search } from 'lucide-react';

// Demonstrates controlled inputs and communicating search/sort/filter state to parent
export default function FilterControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  activeFilter,
  onFilterChange,
  totalCount,
  items,
}) {
  const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <>
      {/* Search & Sort Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="sort-box">
          <label>Sort:</label>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="priority">Highest Priority</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`filter-btn ${activeFilter === tab ? 'active' : ''}`}
            onClick={() => onFilterChange(tab)}
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
    </>
  );
}
