import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { selectAllTasks } from "../../features/tasks/tasksSelectors";
import { Task } from "../../api/tasksApi";

const FixedTaskCounter: React.FC = () => {
  const tasks = useSelector(selectAllTasks);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(tasks.length);
  }, [tasks.length]);

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
      <VStack gap={3} align="start">
        <Text fontSize="lg" fontWeight="semibold">
          Task Counter
        </Text>
        <Text>Total Tasks: {count}</Text>
        <Button onClick={incrementCount} size="sm" colorScheme="blue">
          Add Manual Count
        </Button>
        <VStack align="start" gap={1}>
          <Text fontSize="sm" fontWeight="medium">
            Task Titles:
          </Text>
          {tasks.map((task: Task) => (
            <Text key={task.id} fontSize="sm" color="gray.600">
              {task.title}
            </Text>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default FixedTaskCounter;
