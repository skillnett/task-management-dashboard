// Mock for @chakra-ui/react components
export const Box = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Container = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Heading = ({ children, ...props }) => <h1 {...props}>{children}</h1>;
export const Text = ({ children, ...props }) => <p {...props}>{children}</p>;
export const Button = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>{children}</button>
);
export const IconButton = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>{children}</button>
);
export const Badge = ({ children, ...props }) => <span {...props}>{children}</span>;
export const Spinner = (props) => <div data-testid="spinner" role="status" {...props}>Loading...</div>;
export const Skeleton = (props) => <div data-testid="skeleton" {...props}>Loading...</div>;
export const VStack = ({ children, ...props }) => <div {...props}>{children}</div>;
export const HStack = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SimpleGrid = ({ children, ...props }) => <div role="grid" {...props}>{children}</div>;
export const Stack = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Select = ({ children, ...props }) => <select {...props}>{children}</select>;
export const Option = ({ children, ...props }) => <option {...props}>{children}</option>;
export const Flex = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Center = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Spacer = () => <div style={{ flex: 1 }} />;
export const Divider = () => <hr />;
export const useColorModeValue = (light, dark) => light;
export const useDisclosure = () => ({
  isOpen: false,
  onOpen: jest.fn(),
  onClose: jest.fn(),
  onToggle: jest.fn(),
});
export const useToast = () => jest.fn();
export const useBreakpointValue = (values) => values;
export const useMediaQuery = () => [false];
export const useColorMode = () => ({
  colorMode: 'light',
  toggleColorMode: jest.fn(),
});
export const ColorModeScript = () => null;
export const ChakraProvider = ({ children }) => children;
export const extendTheme = (theme) => theme;
export const createSystem = (config) => config;
export const defaultSystem = {};
