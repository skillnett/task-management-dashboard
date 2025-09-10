import { Container } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./store";
import { TaskDashboard } from "./components/TaskDashboard";

function App() {
  return (
    <Provider store={store}>
      <Container py={[4, 8, 12]}>
        <TaskDashboard />
      </Container>
    </Provider>
  );
}

export default App;
