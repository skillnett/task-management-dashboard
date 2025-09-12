import {
  selectAllTasks,
  selectTasksByStatus,
  selectTaskStats,
  selectIsLoading,
  selectIsFilterLoading,
  selectError,
  selectFilters,
  selectFilteredTasks,
  selectFilteredTasksCount,
  selectUniqueAssignees,
  selectRetryCount,
} from './tasksSelectors';
import { RootState } from '../../store';
import { Task } from '../../api/tasksApi';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task 1',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2024-02-15',
  },
  {
    id: 2,
    title: 'Test Task 2',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Jane Smith',
    dueDate: '2024-02-20',
  },
  {
    id: 3,
    title: 'Test Task 3',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    dueDate: '2024-02-10',
  },
  {
    id: 4,
    title: 'Test Task 4',
    status: 'todo',
    priority: 'critical',
    assignee: 'Alice Johnson',
    dueDate: '2024-02-25',
  },
];

const mockState: RootState = {
  tasks: {
    tasks: mockTasks,
    loading: false,
    filterLoading: false,
    error: null,
    filters: {
      status: '',
      assignee: '',
    },
    retryCount: 0,
  },
};

describe('tasksSelectors', () => {
  describe('selectAllTasks', () => {
    it('should return all tasks', () => {
      const result = selectAllTasks(mockState);
      expect(result).toEqual(mockTasks);
    });

    it('should return empty array when no tasks', () => {
      const emptyState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, tasks: [] },
      };
      const result = selectAllTasks(emptyState);
      expect(result).toEqual([]);
    });
  });

  describe('selectTasksByStatus', () => {
    it('should return all tasks when status is empty', () => {
      const result = selectTasksByStatus(mockState, '');
      expect(result).toEqual(mockTasks);
    });

    it('should return tasks filtered by status', () => {
      const result = selectTasksByStatus(mockState, 'todo');
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'todo')).toBe(true);
    });

    it('should return empty array when no tasks match status', () => {
      const result = selectTasksByStatus(mockState, 'non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('selectTaskStats', () => {
    it('should return correct task statistics', () => {
      const result = selectTaskStats(mockState);
      expect(result).toEqual({
        total: 4,
        todo: 2,
        'in-progress': 1,
        done: 1,
      });
    });

    it('should return zero counts for empty task list', () => {
      const emptyState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, tasks: [] },
      };
      const result = selectTaskStats(emptyState);
      expect(result).toEqual({
        total: 0,
        todo: 0,
        'in-progress': 0,
        done: 0,
      });
    });

    it('should handle tasks with unknown status', () => {
      const tasksWithUnknownStatus: Task[] = [
        ...mockTasks,
        {
          id: 5,
          title: 'Unknown Status Task',
          status: 'unknown' as any,
          priority: 'low',
          assignee: 'Test User',
          dueDate: '2024-02-30',
        },
      ];
      const stateWithUnknownStatus: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, tasks: tasksWithUnknownStatus },
      };
      
      const result = selectTaskStats(stateWithUnknownStatus);
      expect(result.total).toBe(5);
      expect(result.todo).toBe(2);
      expect(result['in-progress']).toBe(1);
      expect(result.done).toBe(1);
    });
  });

  describe('selectIsLoading', () => {
    it('should return loading state', () => {
      const result = selectIsLoading(mockState);
      expect(result).toBe(false);
    });

    it('should return true when loading', () => {
      const loadingState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, loading: true },
      };
      const result = selectIsLoading(loadingState);
      expect(result).toBe(true);
    });
  });

  describe('selectIsFilterLoading', () => {
    it('should return filter loading state', () => {
      const result = selectIsFilterLoading(mockState);
      expect(result).toBe(false);
    });

    it('should return true when filter loading', () => {
      const filterLoadingState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, filterLoading: true },
      };
      const result = selectIsFilterLoading(filterLoadingState);
      expect(result).toBe(true);
    });
  });

  describe('selectError', () => {
    it('should return error state', () => {
      const result = selectError(mockState);
      expect(result).toBeNull();
    });

    it('should return error message when present', () => {
      const errorState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, error: 'Test error' },
      };
      const result = selectError(errorState);
      expect(result).toBe('Test error');
    });
  });

  describe('selectFilters', () => {
    it('should return current filters', () => {
      const result = selectFilters(mockState);
      expect(result).toEqual({
        status: '',
        assignee: '',
      });
    });

    it('should return filters with values', () => {
      const filteredState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: 'todo', assignee: 'John Doe' },
        },
      };
      const result = selectFilters(filteredState);
      expect(result).toEqual({
        status: 'todo',
        assignee: 'John Doe',
      });
    });
  });

  describe('selectFilteredTasks', () => {
    it('should return all tasks when no filters applied', () => {
      const result = selectFilteredTasks(mockState);
      expect(result).toEqual(mockTasks);
    });

    it('should filter by status', () => {
      const statusFilteredState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: 'todo', assignee: '' },
        },
      };
      const result = selectFilteredTasks(statusFilteredState);
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'todo')).toBe(true);
    });

    it('should filter by assignee', () => {
      const assigneeFilteredState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: '', assignee: 'John Doe' },
        },
      };
      const result = selectFilteredTasks(assigneeFilteredState);
      expect(result).toHaveLength(2);
      expect(result.every(task => task.assignee === 'John Doe')).toBe(true);
    });

    it('should filter by both status and assignee', () => {
      const bothFilteredState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: 'todo', assignee: 'John Doe' },
        },
      };
      const result = selectFilteredTasks(bothFilteredState);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('todo');
      expect(result[0].assignee).toBe('John Doe');
    });

    it('should return empty array when no tasks match filters', () => {
      const noMatchState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: 'non-existent', assignee: 'Non-existent' },
        },
      };
      const result = selectFilteredTasks(noMatchState);
      expect(result).toEqual([]);
    });
  });

  describe('selectFilteredTasksCount', () => {
    it('should return count of filtered tasks', () => {
      const result = selectFilteredTasksCount(mockState);
      expect(result).toBe(4);
    });

    it('should return 0 when no tasks match filters', () => {
      const noMatchState: RootState = {
        ...mockState,
        tasks: {
          ...mockState.tasks,
          filters: { status: 'non-existent', assignee: 'Non-existent' },
        },
      };
      const result = selectFilteredTasksCount(noMatchState);
      expect(result).toBe(0);
    });
  });

  describe('selectUniqueAssignees', () => {
    it('should return unique assignees sorted alphabetically', () => {
      const result = selectUniqueAssignees(mockState);
      expect(result).toEqual(['Alice Johnson', 'Jane Smith', 'John Doe']);
    });

    it('should return empty array when no tasks', () => {
      const emptyState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, tasks: [] },
      };
      const result = selectUniqueAssignees(emptyState);
      expect(result).toEqual([]);
    });

    it('should handle duplicate assignees', () => {
      const tasksWithDuplicates: Task[] = [
        ...mockTasks,
        {
          id: 5,
          title: 'Another John Task',
          status: 'todo',
          priority: 'low',
          assignee: 'John Doe',
          dueDate: '2024-02-30',
        },
      ];
      const stateWithDuplicates: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, tasks: tasksWithDuplicates },
      };
      
      const result = selectUniqueAssignees(stateWithDuplicates);
      expect(result).toEqual(['Alice Johnson', 'Jane Smith', 'John Doe']);
      expect(result).toHaveLength(3);
    });
  });

  describe('selectRetryCount', () => {
    it('should return retry count', () => {
      const result = selectRetryCount(mockState);
      expect(result).toBe(0);
    });

    it('should return current retry count', () => {
      const retryState: RootState = {
        ...mockState,
        tasks: { ...mockState.tasks, retryCount: 3 },
      };
      const result = selectRetryCount(retryState);
      expect(result).toBe(3);
    });
  });
});
