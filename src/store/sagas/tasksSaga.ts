import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  Task,
} from '../slices/tasksSlice';

// Action types for saga triggers
export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';

// Action creators for saga triggers
export const fetchTasksRequest = () => ({ type: FETCH_TASKS_REQUEST });
export const createTaskRequest = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => ({
  type: CREATE_TASK_REQUEST,
  payload: task,
});
export const updateTaskRequest = (task: Task) => ({
  type: UPDATE_TASK_REQUEST,
  payload: task,
});
export const deleteTaskRequest = (id: string) => ({
  type: DELETE_TASK_REQUEST,
  payload: id,
});

// Mock API functions (replace with actual API calls)
const mockApi = {
  fetchTasks: async (): Promise<Task[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
      {
        id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task',
        completed: true,
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },
  
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateTask: async (task: Task): Promise<Task> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...task,
      updatedAt: new Date().toISOString(),
    };
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

// Saga functions
function* fetchTasksSaga() {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    const tasks: Task[] = yield call(mockApi.fetchTasks);
    yield put(setTasks(tasks));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to fetch tasks'));
  } finally {
    yield put(setLoading(false));
  }
}

function* createTaskSaga(action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    const newTask: Task = yield call(mockApi.createTask, action.payload);
    yield put(addTask(newTask));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to create task'));
  } finally {
    yield put(setLoading(false));
  }
}

function* updateTaskSaga(action: PayloadAction<Task>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    const updatedTask: Task = yield call(mockApi.updateTask, action.payload);
    yield put(updateTask(updatedTask));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to update task'));
  } finally {
    yield put(setLoading(false));
  }
}

function* deleteTaskSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    
    yield call(mockApi.deleteTask, action.payload);
    yield put(deleteTask(action.payload));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to delete task'));
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher sagas
export function* watchTasksSaga() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeEvery(CREATE_TASK_REQUEST, createTaskSaga);
  yield takeEvery(UPDATE_TASK_REQUEST, updateTaskSaga);
  yield takeEvery(DELETE_TASK_REQUEST, deleteTaskSaga);
}
