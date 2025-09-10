import {
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f3ff' },
          100: { value: '#b3d9ff' },
          200: { value: '#80bfff' },
          300: { value: '#4da6ff' },
          400: { value: '#1a8cff' },
          500: { value: '#0073e6' },
          600: { value: '#005bb3' },
          700: { value: '#004280' },
          800: { value: '#002a4d' },
          900: { value: '#00111a' },
        },
        priority: {
          critical: { value: '#e53e3e' },
          high: { value: '#ed8936' },
          medium: { value: '#d69e2e' },
          low: { value: '#38a169' }
        }
      }
    },
    recipes: {
      button: {
        base: {
          _hover: {
            transform: 'translateY(-1px)',
            boxShadow: 'lg'
          }
        }
      },
      card: {
        base: {
          boxShadow: 'lg',
          _hover: {
            boxShadow: 'xl',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.2s'
        }
      }
    }
  },
  globalCss: {
    body: {
      bg: 'gray.50'
    }
  }
});

const system = createSystem(defaultConfig, config);

export default system;
