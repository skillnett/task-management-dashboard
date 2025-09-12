// Mock for @zag-js/store ES module
export const createStore = jest.fn(() => ({
  subscribe: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
}));
export const createContext = jest.fn();
export const createMachine = jest.fn();
export const assign = jest.fn();
export const send = jest.fn();
export const sendTo = jest.fn();
export const spawn = jest.fn();
export const stop = jest.fn();
export const interpret = jest.fn();
export const createActor = jest.fn();
export const fromPromise = jest.fn();
export const fromObservable = jest.fn();
export const fromCallback = jest.fn();
export const fromEvent = jest.fn();
export const fromTransition = jest.fn();
export const fromReducer = jest.fn();
export const fromSequence = jest.fn();
export const fromPromise = jest.fn();
export const fromObservable = jest.fn();
export const fromCallback = jest.fn();
export const fromEvent = jest.fn();
export const fromTransition = jest.fn();
export const fromReducer = jest.fn();
export const fromSequence = jest.fn();
