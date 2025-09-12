// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the color mode module
jest.mock('./components/ui/color-mode', () => {
  const mockUseColorMode = jest.fn(() => ({
    colorMode: 'light',
    setColorMode: jest.fn(),
    toggleColorMode: jest.fn(),
  }));
  
  const mockUseColorModeValue = jest.fn((light, dark) => light);
  
  return {
    useColorMode: mockUseColorMode,
    useColorModeValue: mockUseColorModeValue,
    ColorModeProvider: ({ children }: { children: React.ReactNode }) => children,
    ColorModeIcon: () => 'ColorModeIcon',
    ColorModeButton: ({ children, ...props }: any) => 'ColorModeButton',
    LightMode: ({ children, ...props }: any) => children,
    DarkMode: ({ children, ...props }: any) => children,
  };
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress React warnings for tests (act() warnings and Chakra UI prop warnings)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      ((args[0].includes('An update to') && args[0].includes('inside a test was not wrapped in act')) ||
       (args[0].includes('React does not recognize the') && args[0].includes('prop on a DOM element')) ||
       (args[0].includes('cannot be a descendant of') && args[0].includes('This will cause a hydration error')) ||
       (args[0].includes('cannot contain a nested') && args[0].includes('See this log for the ancestor stack trace')))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
