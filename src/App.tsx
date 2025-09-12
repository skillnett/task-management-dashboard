import { Box } from "@chakra-ui/react";
import { ColorModeProvider } from "./components/ui/color-mode";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";
import FixedTaskCounter from "./components/TaskDashboard/TaskCounter";

function App() {
  return (
    <ColorModeProvider>
      <Box>
        <TaskDashboard />
        <FixedTaskCounter />
      </Box>
    </ColorModeProvider>
  );
}

export default App;
