import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button
} from '@chakra-ui/react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="lg"
            p={6}
          >
            <VStack align="start" gap={4}>
              <Heading size="md" color="red.600">
                ⚠️ Something went wrong!
              </Heading>
              <Text color="red.600">
                The dashboard encountered an error. Please refresh the page or contact support.
              </Text>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </VStack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
