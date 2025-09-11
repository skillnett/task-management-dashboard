// Types
export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  createdAt?: string;
  isUpdating?: boolean;
}

export interface TaskFilters {
  status?: string;
  assignee?: string;
}

// Simulated API with intentional delays
const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Review PR #123', status: 'in-progress', priority: 'high', assignee: 'John Doe', dueDate: '2024-02-15' },
  { id: 2, title: 'Update documentation', status: 'todo', priority: 'low', assignee: 'Jane Smith', dueDate: '2024-02-20' },
  { id: 3, title: 'Fix login bug', status: 'done', priority: 'critical', assignee: 'John Doe', dueDate: '2024-02-10' },
  { id: 4, title: 'Implement new feature', status: 'todo', priority: 'medium', assignee: 'Alice Johnson', dueDate: '2024-02-25' },
  { id: 5, title: 'Code review for feature X', status: 'in-progress', priority: 'high', assignee: 'Bob Wilson', dueDate: '2024-02-18' },
  { id: 6, title: 'Write unit tests', status: 'todo', priority: 'medium', assignee: 'Jane Smith', dueDate: '2024-02-22' },
  { id: 7, title: 'Deploy to staging', status: 'done', priority: 'critical', assignee: 'John Doe', dueDate: '2024-02-12' },
  { id: 8, title: 'Performance optimization', status: 'in-progress', priority: 'high', assignee: 'Alice Johnson', dueDate: '2024-02-28' },
  { id: 9, title: 'Update dependencies', status: 'todo', priority: 'low', assignee: 'Bob Wilson', dueDate: '2024-03-01' },
  { id: 10, title: 'Security audit', status: 'done', priority: 'critical', assignee: 'Jane Smith', dueDate: '2024-02-08' }
];

export const tasksAPI = {
  fetchTasks: (filters: TaskFilters = {}): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly fail 5% of requests for error handling testing
        if (Math.random() > 0.95) {
          reject(new Error('Failed to fetch tasks'));
        }
        
        let filtered = [...MOCK_TASKS];
        if (filters.status) {
          filtered = filtered.filter(t => t.status === filters.status);
        }
        if (filters.assignee) {
          filtered = filtered.filter(t => t.assignee === filters.assignee);
        }
        resolve(filtered);
      }, 800); // Reduced delay for better UX
    });
  },
  
  updateTaskStatus: (taskId: number, newStatus: Task['status']): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.95) {
          reject(new Error('Failed to update task'));
        }
        const task = MOCK_TASKS.find(t => t.id === taskId);
        if (task) {
          const updatedTask = { ...task, status: newStatus };
          resolve(updatedTask);
        } else {
          reject(new Error('Task not found'));
        }
      }, 800);
    });
  },
  
  createTask: (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        MOCK_TASKS.push(newTask);
        resolve(newTask);
      }, 1000);
    });
  }
};
