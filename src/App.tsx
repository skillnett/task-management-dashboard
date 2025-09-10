import { Box } from "@chakra-ui/react";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";
import FixedTaskCounter from "./components/TaskDashboard/TaskCounter";

function App() {
  return (
    <Box>
      <TaskDashboard />
      <FixedTaskCounter />
    </Box>
  );
}

export default App;
