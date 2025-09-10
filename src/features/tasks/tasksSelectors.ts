import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { TasksState } from './tasksSlice';

// Basic selectors
const selectTasksState = (state: RootState): TasksState => state.tasks;

export const selectAllTasks = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.tasks
);

export const selectTasksByStatus = createSelector(
  [selectAllTasks, (state: RootState, status: string) => status],
  (tasks, status) => {
    if (!status) return tasks;
    return tasks.filter(task => task.status === status);
  }
);

export const selectTaskStats = createSelector(
  [selectAllTasks],
  (tasks) => {
    const stats = {
      total: tasks.length,
      todo: 0,
      'in-progress': 0,
      done: 0
    };
    
    tasks.forEach(task => {
      if (stats.hasOwnProperty(task.status)) {
        stats[task.status]++;
      }
    });
    
    return stats;
  }
);

export const selectIsLoading = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.loading
);

export const selectError = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.error
);

export const selectFilters = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.filters
);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (tasks, filters) => {
    let filtered = [...tasks];
    
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }
    
    return filtered;
  }
);

export const selectUniqueAssignees = createSelector(
  [selectAllTasks],
  (tasks) => {
    const assignees = Array.from(new Set(tasks.map(task => task.assignee)));
    return assignees.sort();
  }
);

export const selectRetryCount = createSelector(
  [selectTasksState],
  (tasksState) => tasksState.retryCount
);
