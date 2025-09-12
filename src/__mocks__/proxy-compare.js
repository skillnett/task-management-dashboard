// Mock for proxy-compare ES module
export const createProxy = jest.fn((obj) => obj);
export const isChanged = jest.fn(() => false);
export const getUntrackedObject = jest.fn((obj) => obj);
export const trackMemo = jest.fn();
export const untrack = jest.fn();
