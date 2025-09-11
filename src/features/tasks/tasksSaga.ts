import { call, put, takeEvery, select, delay } from 'redux-saga/effects';
import { tasksAPI, Task, TaskFilters } from '../../api/tasksApi';
import { RootState } from '../../store';
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskStatusSuccess,
  updateTaskStatusFailure,
  incrementRetryCount,
  resetRetryCount
} from './tasksSlice';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // Base delay in ms

// Exponential backoff delay calculation
function getRetryDelay(retryCount: number): number {
  return RETRY_DELAY * Math.pow(2, retryCount - 1);
}

// Fetch tasks saga with retry logic
function* fetchTasksSaga(action: { type: string; payload?: TaskFilters }) {
  const retryCount: number = yield select((state: RootState) => state.tasks.retryCount);
  
  try {
    const filters = action.payload || {};
    const tasks: Task[] = yield call(tasksAPI.fetchTasks, filters);
    yield put(fetchTasksSuccess(tasks));
    yield put(resetRetryCount());
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    if (retryCount < MAX_RETRIES) {
      yield put(incrementRetryCount());
      const delayTime: number = yield call(getRetryDelay, retryCount + 1);
      yield delay(delayTime);
      yield put(fetchTasksRequest());
    } else {
      yield put(fetchTasksFailure(errorMessage));
      yield put(resetRetryCount());
    }
  }
}

// Update task status saga with optimistic updates
function* updateTaskStatusSaga(action: { type: string; payload: { taskId: number; newStatus: Task['status']; originalStatus: Task['status'] } }) {
  const { taskId, newStatus, originalStatus } = action.payload;
  
  try {
    // API call
    const updatedTask: Task = yield call(tasksAPI.updateTaskStatus, taskId, newStatus);
    
    // Success - confirm the update
    yield put(updateTaskStatusSuccess(updatedTask));
  } catch (error: unknown) {
    // Failure - rollback optimistic update
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(updateTaskStatusFailure({
      taskId,
      originalStatus: originalStatus,
      error: errorMessage
    }));
  }
}

// Debounced fetch tasks saga
function* debouncedFetchTasksSaga(action: { type: string; payload?: TaskFilters }) {
  yield delay(300); // 300ms debounce
  yield put(fetchTasksRequest());
}

// Root watcher saga
export function* watchTasksSaga() {
  yield takeEvery('tasks/fetchTasksRequest', fetchTasksSaga);
  yield takeEvery('tasks/updateTaskStatusRequest', updateTaskStatusSaga);
  yield takeEvery('DEBOUNCED_FETCH_TASKS', debouncedFetchTasksSaga);
}
