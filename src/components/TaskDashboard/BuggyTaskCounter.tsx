import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Text, Button } from '@chakra-ui/react';
import { RootState } from '../../store';
import { Task } from '../../api/tasksApi';

const BuggyTaskCounter = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(tasks.length);
  }, [tasks.length]);
  
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
    setCount(count);
  };
  
  return (
    <Box>
      <Text>Total Tasks: {count}</Text>
      <Button onClick={incrementCount}>Add Manual Count</Button>
      {tasks.map((task: Task) => 
        <Text key={task.id}>{task.title}</Text>
      )}
    </Box>
  );
};

export default BuggyTaskCounter;
