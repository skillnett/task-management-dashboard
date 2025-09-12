import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Button, VStack, Badge } from "@chakra-ui/react";
import { selectAllTasks, selectTaskStats } from "../../features/tasks/tasksSelectors";
import { Task } from "../../api/tasksApi";
import { useColorModeValue } from "../ui/color-mode";

const TaskCounter: React.FC = () => {
  const tasks = useSelector(selectAllTasks);
  const stats = useSelector(selectTaskStats);
  const [count, setCount] = useState(0);
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    setCount(tasks.length);
  }, [tasks.length]);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <Box p={4} border="1px" borderColor={borderColor} borderRadius="md" bg={bgColor}>
      <VStack gap={3} align="start">
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Task Counter
        </Text>
        
        {/* Stats Section */}
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

        <Button onClick={incrementCount} size="sm" colorScheme="blue">
          Add Manual Count
        </Button>
        <VStack align="start" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Task Titles:
          </Text>
          {tasks.map((task: Task) => (
            <Text key={task.id} fontSize="sm" color={labelColor}>
              {task.title}
            </Text>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default TaskCounter;
