import React from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack, Badge } from "@chakra-ui/react";
import { selectAllTasks, selectTaskStats } from "../../features/tasks/tasksSelectors";
import { Task } from "../../api/tasksApi";
import { useTheme } from "next-themes";

const TaskCounter: React.FC = () => {
  const tasks = useSelector(selectAllTasks);
  const stats = useSelector(selectTaskStats);
  const { theme } = useTheme();

  // Color mode values
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'gray.800' : 'white';
  const borderColor = isDark ? 'gray.600' : 'gray.200';
  const textColor = isDark ? 'gray.200' : 'gray.700';
  const labelColor = isDark ? 'gray.300' : 'gray.600';



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
