// Mock for @ark-ui/react ES module
export const createPresence = jest.fn(() => ({
  present: false,
  onPresentChange: jest.fn(),
}));
export const createDownloadTrigger = jest.fn(() => ({
  download: jest.fn(),
}));
export const format = jest.fn((value) => value);
