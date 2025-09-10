import { all, fork } from 'redux-saga/effects';
import { watchTasksSaga } from '../features/tasks/tasksSaga';

export default function* rootSaga() {
  yield all([
    fork(watchTasksSaga)
  ]);
}
