export const useColorMode = jest.fn(() => ({
  colorMode: 'light',
  setColorMode: jest.fn(),
  toggleColorMode: jest.fn(),
}));

export const useColorModeValue = jest.fn((light, dark) => light);

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => children;

export const ColorModeIcon = () => <div>ColorModeIcon</div>;

export const ColorModeButton = ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
);

export const LightMode = ({ children, ...props }: any) => <span {...props}>{children}</span>;

export const DarkMode = ({ children, ...props }: any) => <span {...props}>{children}</span>;
