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
import { selectTaskStats, selectError, selectFilteredTasksCount, selectAllTasks, selectIsLoading } from '../../features/tasks/tasksSelectors';
import { fetchTasksRequest, clearError } from '../../features/tasks/tasksSlice';
import TaskFilters from './TaskFilters';
import TaskList from './TaskList';
import ErrorBoundary from './ErrorBoundary';
import { useColorMode, useColorModeValue } from '../ui/color-mode';

const TaskDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectTaskStats);
  const error = useSelector(selectError);
  const filteredTasksCount = useSelector(selectFilteredTasksCount);
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectIsLoading);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(false);
  
  // Always call hooks at the top level - handle errors in the hook implementation
  const colorModeResult = useColorMode();
  const colorMode = colorModeResult?.colorMode || 'light';
  const toggleColorMode = colorModeResult?.toggleColorMode || (() => {});
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const toggleStats = () => setShowStats(!showStats);

  useEffect(() => {
    // Only fetch tasks if we don't have any tasks and we're not already loading
    if (tasks.length === 0 && !loading) {
      dispatch(fetchTasksRequest());
    }
  }, [dispatch, tasks.length, loading]);

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
                borderColor={borderColor}
                position="sticky"
                top={4}
                zIndex={1}
              >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="lg" color={textColor}>
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
                    title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {colorMode === 'dark' ? '☀️' : '🌙'}
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
                  <Box height="1px" mt={4} bg={dividerColor} mb={4} />
                  <Box display="flex" gap={6} flexWrap="wrap">
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color={labelColor}>Total Tasks</Text>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {stats.total}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color={labelColor}>To Do</Text>
                      <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
                        {stats.todo}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color={labelColor}>In Progress</Text>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {stats['in-progress']}
                      </Badge>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Text fontSize="sm" color={labelColor}>Done</Text>
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
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Tasks ({filteredTasksCount})
                </Text>
                <Text fontSize="sm" color={labelColor}>
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
