import { FC } from "react";
import {
  Box,
  SimpleGrid,
  Stack,
  Skeleton,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredTasks,
  selectIsLoading,
  selectIsFilterLoading,
  selectError,
} from "../../features/tasks/tasksSelectors";
import { fetchTasksRequest } from "../../features/tasks/tasksSlice";
import TaskCard from "./TaskCard";

interface TaskListProps {
  viewMode?: "grid" | "list";
}

const TaskList: FC<TaskListProps> = ({ viewMode = "grid" }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const loading = useSelector(selectIsLoading);
  const filterLoading = useSelector(selectIsFilterLoading);
  const error = useSelector(selectError);

  const handleRetry = () => {
    dispatch(fetchTasksRequest());
  };

  if (loading || filterLoading) {
    return (
      <Box>
        {viewMode === "grid" ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height="200px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <Stack gap={4}>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height="120px" borderRadius="lg" />
            ))}
          </Stack>
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        bg="red.50"
        border="1px"
        borderColor="red.200"
        borderRadius="lg"
        p={6}
      >
        <VStack gap={4} align="start">
          <Text fontSize="lg" fontWeight="semibold" color="red.600">
            ⚠️ Error loading tasks!
          </Text>
          <Text color="red.600">{error}</Text>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </VStack>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <VStack gap={4} py={12}>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          No tasks found matching your filters
        </Text>
        <Text fontSize="sm" color="gray.400" textAlign="center">
          Try adjusting your filters or create a new task
        </Text>
      </VStack>
    );
  }

  return (
    <Box>
      {viewMode === "grid" ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SimpleGrid>
      ) : (
        <Stack gap={4}>
          {tasks.map((task) => (
            <Box key={task.id} w="100%">
              <TaskCard task={task} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TaskList;
