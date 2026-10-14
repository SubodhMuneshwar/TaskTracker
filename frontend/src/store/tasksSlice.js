import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api/tasks';

// 1. Fetch all tasks from .NET Web API
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch tasks from server');
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 2. Add a new task
export const addTask = createAsyncThunk('tasks/addTask', async (newTask, { rejectWithValue }) => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 3. Update an existing task
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// 4. Delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: 'All', // 'All' | 'Pending' | 'In Progress' | 'Completed'
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to connect to backend';
      })
      // addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;
