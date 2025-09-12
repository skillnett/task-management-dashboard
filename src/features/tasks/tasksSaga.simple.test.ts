import { takeEvery } from 'redux-saga/effects';
import { watchTasksSaga } from './tasksSaga';

describe('tasksSaga', () => {
  it('should watch for the correct actions', () => {
    const generator = watchTasksSaga();
    
    // Check that it takes every fetchTasksRequest action
    const fetchEffect = generator.next();
    expect(fetchEffect.value).toEqual(takeEvery('tasks/fetchTasksRequest', expect.any(Function)));
    
    // Check that it takes every updateTaskStatusRequest action
    const updateEffect = generator.next();
    expect(updateEffect.value).toEqual(takeEvery('tasks/updateTaskStatusRequest', expect.any(Function)));
    
    // Check that it takes every debounced fetch action
    const debouncedEffect = generator.next();
    expect(debouncedEffect.value).toEqual(takeEvery('DEBOUNCED_FETCH_TASKS', expect.any(Function)));
    
    // Should be done
    const done = generator.next();
    expect(done.done).toBe(true);
  });
});