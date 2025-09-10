import { all, fork } from 'redux-saga/effects';
import { watchTasksSaga } from './tasksSaga';

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    fork(watchTasksSaga),
    // Add more sagas here as needed
  ]);
}
