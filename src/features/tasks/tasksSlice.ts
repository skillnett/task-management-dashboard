import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../api/tasksApi';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  filterLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    assignee: string;
  };
  retryCount: number;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  filterLoading: false,
  error: null,
  filters: {
    status: '',
    assignee: ''
  },
  retryCount: 0
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Fetch tasks actions
    fetchTasksRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.filterLoading = false;
      state.tasks = action.payload;
      state.error = null;
      state.retryCount = 0;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.filterLoading = false;
      state.error = action.payload;
    },
    
    // Update task status actions
    updateTaskStatusRequest: (state, action: PayloadAction<{taskId: number, newStatus: Task['status'], originalStatus: Task['status']}>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
        task.isUpdating = true;
      }
    },
    updateTaskStatusSuccess: (state, action: PayloadAction<Task>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.isUpdating = false;
      }
    },
    updateTaskStatusFailure: (state, action: PayloadAction<{taskId: number, originalStatus: Task['status'], error: string}>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.originalStatus;
        task.isUpdating = false;
      }
      state.error = action.payload.error;
    },
    
    // Filter actions
    setFilter: (state, action: PayloadAction<Partial<{status: string, assignee: string}>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filterLoading = true;
    },
    clearFilters: (state) => {
      state.filters = { status: '', assignee: '' };
      state.filterLoading = true;
    },
    setFilterLoading: (state, action: PayloadAction<boolean>) => {
      state.filterLoading = action.payload;
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Retry logic
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    }
  }
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskStatusRequest,
  updateTaskStatusSuccess,
  updateTaskStatusFailure,
  setFilter,
  clearFilters,
  setFilterLoading,
  clearError,
  incrementRetryCount,
  resetRetryCount
} = tasksSlice.actions;

export default tasksSlice.reducer;
