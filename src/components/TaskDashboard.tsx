import { useEffect } from 'react';
import { Box, Button, Text, Spinner } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasksRequest, createTaskRequest } from '../store/sagas/tasksSaga';
import { toggleTaskComplete } from '../store/slices/tasksSlice';
import { Task } from '../store/slices/tasksSlice';

export const TaskDashboard = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);

  useEffect(() => {
    // Fetch tasks when component mounts
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  const handleAddTask = () => {
    const newTask = {
      title: `New Task ${tasks.length + 1}`,
      description: 'This is a new task created via Redux Saga',
      completed: false,
      priority: 'medium' as const,
    };
    dispatch(createTaskRequest(newTask));
  };

  const handleToggleTask = (taskId: string) => {
    dispatch(toggleTaskComplete(taskId));
  };

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading tasks...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" border="1px" borderColor="red.200" borderRadius="md">
        <Text color="red.600">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Button onClick={handleAddTask} colorScheme="blue" mb={4}>
          Add New Task
        </Button>
        <Button onClick={() => dispatch(fetchTasksRequest())} ml={2} mb={4}>
          Refresh Tasks
        </Button>
      </Box>

      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Tasks ({tasks.length})
      </Text>

      {tasks.length === 0 ? (
        <Text color="gray.500">No tasks found. Click "Add New Task" to create one.</Text>
      ) : (
        <Box>
          {tasks.map((task: Task) => (
            <Box
              key={task.id}
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg={task.completed ? 'gray.50' : 'white'}
              mb={2}
            >
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  textDecoration={task.completed ? 'line-through' : 'none'}
                  color={task.completed ? 'gray.500' : 'black'}
                  mb={2}
                >
                  {task.title}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {task.description}
                </Text>
                <Box display="flex" gap={2} alignItems="center">
                  <Text fontSize="xs" color="gray.500">
                    Priority: {task.priority}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme={task.completed ? 'green' : 'gray'}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
