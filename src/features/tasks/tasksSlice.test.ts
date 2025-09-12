import tasksReducer, {
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
  resetRetryCount,
  TasksState,
} from './tasksSlice';
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
];

const initialState: TasksState = {
  tasks: [],
  loading: false,
  filterLoading: false,
  error: null,
  filters: {
    status: '',
    assignee: '',
  },
  retryCount: 0,
};

describe('tasksSlice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('fetch tasks actions', () => {
    it('should handle fetchTasksRequest', () => {
      const state = { ...initialState, error: 'Previous error' };
      const newState = tasksReducer(state, fetchTasksRequest());
      
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fetchTasksSuccess', () => {
      const state = { ...initialState, loading: true, filterLoading: true };
      const newState = tasksReducer(state, fetchTasksSuccess(mockTasks));
      
      expect(newState.loading).toBe(false);
      expect(newState.filterLoading).toBe(false);
      expect(newState.tasks).toEqual(mockTasks);
      expect(newState.error).toBeNull();
      expect(newState.retryCount).toBe(0);
    });

    it('should handle fetchTasksFailure', () => {
      const state = { ...initialState, loading: true, filterLoading: true };
      const errorMessage = 'Failed to fetch tasks';
      const newState = tasksReducer(state, fetchTasksFailure(errorMessage));
      
      expect(newState.loading).toBe(false);
      expect(newState.filterLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('update task status actions', () => {
    const stateWithTasks: TasksState = {
      ...initialState,
      tasks: mockTasks,
    };

    it('should handle updateTaskStatusRequest', () => {
      const taskId = 1;
      const newStatus = 'in-progress';
      const originalStatus = 'todo';
      
      const newState = tasksReducer(
        stateWithTasks,
        updateTaskStatusRequest({ taskId, newStatus, originalStatus })
      );
      
      const updatedTask = newState.tasks.find(task => task.id === taskId);
      expect(updatedTask?.status).toBe(newStatus);
      expect(updatedTask?.isUpdating).toBe(true);
    });

    it('should handle updateTaskStatusRequest with non-existent task', () => {
      const taskId = 999;
      const newStatus = 'in-progress';
      const originalStatus = 'todo';
      
      const newState = tasksReducer(
        stateWithTasks,
        updateTaskStatusRequest({ taskId, newStatus, originalStatus })
      );
      
      expect(newState.tasks).toEqual(stateWithTasks.tasks);
    });

    it('should handle updateTaskStatusSuccess', () => {
      const stateWithUpdatingTask: TasksState = {
        ...stateWithTasks,
        tasks: stateWithTasks.tasks.map(task => 
          task.id === 1 ? { ...task, isUpdating: true } : task
        ),
      };
      
      const updatedTask: Task = {
        id: 1,
        title: 'Test Task 1',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Doe',
        dueDate: '2024-02-15',
      };
      
      const newState = tasksReducer(
        stateWithUpdatingTask,
        updateTaskStatusSuccess(updatedTask)
      );
      
      const task = newState.tasks.find(t => t.id === 1);
      expect(task?.status).toBe('in-progress');
      expect(task?.isUpdating).toBe(false);
    });

    it('should handle updateTaskStatusFailure', () => {
      const stateWithUpdatingTask: TasksState = {
        ...stateWithTasks,
        tasks: stateWithTasks.tasks.map(task => 
          task.id === 1 ? { ...task, status: 'in-progress', isUpdating: true } : task
        ),
      };
      
      const failurePayload = {
        taskId: 1,
        originalStatus: 'todo' as Task['status'],
        error: 'Failed to update task',
      };
      
      const newState = tasksReducer(
        stateWithUpdatingTask,
        updateTaskStatusFailure(failurePayload)
      );
      
      const task = newState.tasks.find(t => t.id === 1);
      expect(task?.status).toBe('todo');
      expect(task?.isUpdating).toBe(false);
      // Note: updateTaskStatusFailure doesn't set global error - individual task errors are handled at task level
      expect(newState.error).toBeNull();
    });
  });

  describe('filter actions', () => {
    it('should handle setFilter with status', () => {
      const newState = tasksReducer(
        initialState,
        setFilter({ status: 'todo' })
      );
      
      expect(newState.filters.status).toBe('todo');
      expect(newState.filters.assignee).toBe('');
    });

    it('should handle setFilter with assignee', () => {
      const newState = tasksReducer(
        initialState,
        setFilter({ assignee: 'John Doe' })
      );
      
      expect(newState.filters.assignee).toBe('John Doe');
      expect(newState.filters.status).toBe('');
    });

    it('should handle setFilter with both status and assignee', () => {
      const newState = tasksReducer(
        initialState,
        setFilter({ status: 'in-progress', assignee: 'Jane Smith' })
      );
      
      expect(newState.filters.status).toBe('in-progress');
      expect(newState.filters.assignee).toBe('Jane Smith');
    });

    it('should handle clearFilters', () => {
      const stateWithFilters: TasksState = {
        ...initialState,
        filters: { status: 'todo', assignee: 'John Doe' },
      };
      
      const newState = tasksReducer(stateWithFilters, clearFilters());
      
      expect(newState.filters.status).toBe('');
      expect(newState.filters.assignee).toBe('');
    });

    it('should handle setFilterLoading', () => {
      const newState = tasksReducer(
        initialState,
        setFilterLoading(true)
      );
      
      expect(newState.filterLoading).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle clearError', () => {
      const stateWithError: TasksState = {
        ...initialState,
        error: 'Some error',
      };
      
      const newState = tasksReducer(stateWithError, clearError());
      
      expect(newState.error).toBeNull();
    });
  });

  describe('retry logic', () => {
    it('should handle incrementRetryCount', () => {
      const newState = tasksReducer(initialState, incrementRetryCount());
      
      expect(newState.retryCount).toBe(1);
    });

    it('should handle resetRetryCount', () => {
      const stateWithRetryCount: TasksState = {
        ...initialState,
        retryCount: 3,
      };
      
      const newState = tasksReducer(stateWithRetryCount, resetRetryCount());
      
      expect(newState.retryCount).toBe(0);
    });
  });
});
