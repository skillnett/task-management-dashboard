import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { selectAllTasks } from "../../features/tasks/tasksSelectors";
import { Task } from "../../api/tasksApi";
import { useColorModeValue } from "../ui/color-mode";

const FixedTaskCounter: React.FC = () => {
  const tasks = useSelector(selectAllTasks);
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
        <Text color={textColor}>Total Tasks: {count}</Text>
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

export default FixedTaskCounter;
