import { Box } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./store";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";
import FixedTaskCounter from "./components/TaskDashboard/TaskCounter";

function App() {
  return (
    <Provider store={store}>
      <Box>
        <TaskDashboard />
        <FixedTaskCounter />
      </Box>
    </Provider>
  );
}

export default App;
