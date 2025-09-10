import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  Text,
  IconButton,
  Badge
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTaskStats, selectError } from '../../features/tasks/tasksSelectors';
import { fetchTasksRequest, clearError } from '../../features/tasks/tasksSlice';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import ErrorBoundary from './ErrorBoundary';

const TaskDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectTaskStats);
  const error = useSelector(selectError);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleStats = () => setShowStats(!showStats);
  const toggleColorMode = () => setIsDarkMode(!isDarkMode);
  
  const bgColor = isDarkMode ? 'gray.900' : 'gray.50';
  const headerBg = isDarkMode ? 'gray.800' : 'white';

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  const handleViewModeToggle = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchTasksRequest());
  };

  return (
    <ErrorBoundary>
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={8}>
          <Box display="flex" flexDirection="column" gap={8}>
            {/* Header */}
            <Box
              bg={headerBg}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Heading size="lg" color="gray.700">
                  Task Management Dashboard
                </Heading>
                <Box display="flex" gap={2}>
                  <IconButton
                    onClick={handleViewModeToggle}
                    variant="outline"
                    size="sm"
                    title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                  >
                    {viewMode === 'grid' ? '📋' : '⊞'}
                  </IconButton>
                  <IconButton
                    onClick={toggleColorMode}
                    variant="outline"
                    size="sm"
                    title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </IconButton>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleStats}
                    colorScheme="blue"
                  >
                    {showStats ? 'Hide' : 'Show'} Stats
                  </Button>
                </Box>
              </Box>

              {/* Stats Section */}
              {showStats && (
                <>
                  <Box height="1px" bg="gray.200" mb={4} />
                  <Box display="flex" gap={6} flexWrap="wrap">
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color="gray.600">Total Tasks</Text>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {stats.total}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color="gray.600">To Do</Text>
                      <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
                        {stats.todo}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color="gray.600">In Progress</Text>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {stats['in-progress']}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color="gray.600">Done</Text>
                      <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                        {stats.done}
                      </Badge>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* Error Display */}
            {error && (
              <Box
                bg="red.50"
                border="1px"
                borderColor="red.200"
                borderRadius="lg"
                p={4}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Text color="red.600">
                    <strong>Error:</strong> {error}
                  </Text>
                  <Button size="sm" colorScheme="red" variant="outline" onClick={handleRetry}>
                    Retry
                  </Button>
                </Box>
              </Box>
            )}

            {/* Filters */}
            <TaskFilters />

            {/* Task List */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Tasks ({stats.total})
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {viewMode === 'grid' ? 'Grid View' : 'List View'}
                </Text>
              </Box>
              <TaskList viewMode={viewMode} />
            </Box>
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default TaskDashboard;
